import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/server/lib/api-wrapper";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";
import { Calculation } from "@/server/db/entities/Calculation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Helper untuk format angka dan memastikan data TypeORM adalah number
const toFloat = (val: any) => parseFloat(val || "0");

// Endpoint untuk mengambil semua data yang dibutuhkan dashboard dalam 1x hit
export async function GET(req: NextRequest) {
  return withAuth(req, { permission: "dashboard:read:any" }, async (user) => {
    await initializeDB();
    const userRepo = AppDataSource.getRepository(User);
    const calcRepo = AppDataSource.getRepository(Calculation);

    // ====================================================================
    // 1. DATA QUERIES DARI DATABASE
    // ====================================================================

    const totalUsers = await userRepo.count();
    const criticalCalcs = await calcRepo
      .createQueryBuilder("calc")
      .where("calc.roiPercentage < :minRoi", { minRoi: 0 })
      .getCount();
    const avgRoiResult = await calcRepo
      .createQueryBuilder("calc")
      .select("AVG(calc.roiPercentage)", "avgRoi")
      .getRawOne();

    // Konversi AVG result ke float
    const avgRoi = toFloat(avgRoiResult.avgRoi);

    // A. Top Users (5 User terbaru untuk list)
    const topUsers = await userRepo.find({
      // 🎯 FIX: 'id' dan 'createdAt' wajib ada untuk sorting dan key
      select: ["id", "name", "email", "avatarUrl", "createdAt"],
      order: { createdAt: "DESC" },
      take: 5,
      relations: ["roles"],
    });

    // B. Ambil 5 user yang baru mendaftar (untuk Activity Log)
    const recentRegistrations = await userRepo.find({
      select: ["id", "name", "createdAt"], // Tambahkan ID untuk relasi jika perlu
      order: { createdAt: "DESC" },
      take: 5,
    });

    // C. Ambil 5 perhitungan ROI terbaru (dengan nama user untuk Activity Log)
    const recentCalculations = await calcRepo.find({
      select: ["id", "roiPercentage", "createdAt"],
      order: { createdAt: "DESC" },
      take: 5,
      // 🎯 WAJIB: Ambil relasi user + field nama agar bisa ditampilkan di log
      relations: ["user"],
    });

    // ====================================================================
    // 2. MAPPING & LOGIC
    // ====================================================================

    // 2.1 ROI Status Logic
    const roiAlert =
      avgRoi < 0
        ? `Peringatan: ROI rata-rata negatif (${avgRoi.toFixed(
            1
          )}%). Segera optimasi.`
        : `Rata-rata ROI sehat (${avgRoi.toFixed(1)}%). Pertimbangkan scaling.`;

    // 2.2 MAPPING TOP USERS (Final Format)
    const formattedTopUsers = topUsers.map((u: any) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      avatarUrl: u.avatarUrl,
      role: u.roles[0]?.name || "No Role",
      createdAt: u.createdAt, // Tambahkan ini agar bisa di-sort
    }));

    // 2.3 MAPPING & MERGE ACTIVITIES
    const registrationActivities = recentRegistrations.map((u: any) => ({
      // Kita tambahkan properti 'timestamp' untuk sorting yang akurat
      timestamp: u.createdAt,
      user: u.name,
      action: "registered to the platform.",
      when: dayjs(u.createdAt).fromNow(),
      color: "#3b82f6", // Biru
    }));

    const calculationActivities = recentCalculations.map((c: any) => {
      // Pastikan c.user ada, jika tidak, anggap dari 'System'
      const userName = c.user?.name || "Anonymous User";
      const roi = toFloat(c.roiPercentage);

      return {
        timestamp: c.createdAt,
        user: userName,
        action: `ran a calculation (ROI: ${roi.toFixed(1)}%).`,
        when: dayjs(c.createdAt).fromNow(),
        color: roi >= 0 ? "#10b981" : "#ef4444", // Hijau/Merah
      };
    });

    // Gabungkan dan sort berdasarkan timestamp
    const allActivities = [...registrationActivities, ...calculationActivities]
      .sort(
        (a, b) => dayjs(b.timestamp).valueOf() - dayjs(a.timestamp).valueOf()
      )
      .slice(0, 10);

    // ====================================================================
    // 3. FINAL RESPONSE
    // ====================================================================

    const dashboardData = {
      kpis: [
        {
          title: "Total Users",
          value: totalUsers,
          iconKey: "users",
          color: "#3b82f6",
        },
        {
          title: "Critical ROIs",
          value: criticalCalcs,
          iconKey: "warning",
          color: "#ef4444",
        },
        {
          title: "Avg ROI",
          value: `${avgRoi.toFixed(1)}%`,
          iconKey: "roi",
          color: "#10b981",
        },
        {
          title: "My Access",
          value: user.roles[0]?.name || "Guest",
          iconKey: "settings",
          color: "#8b5cf6",
        },
      ],

      roiStatus: {
        score: Math.min(100, Math.max(0, avgRoi + 50)),
        alert: roiAlert,
      },

      activities: allActivities,

      // Tasks (Mock yang lebih relevan)
      systemTasks: [
        { task: "Approve 3 pending access requests", priority: "High" },
        { task: "Review 2 critical access changes", priority: "Medium" },
      ],

      // Ganti topUsers dengan hasil mapping yang sudah lengkap
      topUsers: formattedTopUsers,
    };

    return NextResponse.json(dashboardData);
  });
}
