import { NextRequest, NextResponse } from "next/server";
import { withAuth } from "@/server/lib/api-wrapper";
import { AppDataSource, initializeDB } from "@/server/db/datasource";
import { User } from "@/server/db/entities/User";
import { Calculation } from "@/server/db/entities/Calculation";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Helper
const toFloat = (val: any) => parseFloat(val || "0");

// Endpoint untuk mengambil semua data yang dibutuhkan dashboard dalam 1x hit
export async function GET(req: NextRequest) {
  return withAuth(
    req,
    { basePermission: "dashboard:read" },
    async (user, effectiveScope, _apiReq) => {
      await initializeDB();
      const userRepo = AppDataSource.getRepository(User);
      const calcRepo = AppDataSource.getRepository(Calculation);

      // Tentukan parameter yang akan digunakan
      const queryParams: { [key: string]: any } = { minRoi: 0 };

      // Tambahkan user ID ke parameter jika scope adalah 'own'
      if (effectiveScope === "own") {
        queryParams.userId = user.id;
      }

      // ----------------------------------------------------
      // Kueri Utama: Avg ROI (Base untuk Kueri Agregat)
      // ----------------------------------------------------

      let avgRoiQuery = calcRepo
        .createQueryBuilder("calc")
        .select("AVG(calc.roiPercentage)", "avgRoi");

      // Injeksi WHERE untuk AVG ROI
      if (effectiveScope === "own") {
        // Ganti 'calc.userId' dengan 'calc.userId' atau 'calc.user_id' sesuai skema DB Anda
        // Saya menggunakan 'calc.userId' karena ini nama properti relasi yang paling sering dipakai
        avgRoiQuery = avgRoiQuery.where("calc.userId = :userId");
      }

      const avgRoiResult = await avgRoiQuery
        .setParameters(queryParams) // Set parameter ke QueryBuilder
        .getRawOne();

      const avgRoi = toFloat(avgRoiResult.avgRoi);

      // ----------------------------------------------------
      // Kueri Tambahan: Critical Calcs
      // ----------------------------------------------------

      let criticalCalcsQuery = calcRepo
        .createQueryBuilder("calc")
        .where("calc.roiPercentage < :minRoi");

      // Injeksi AND WHERE untuk Critical Calcs (Jika scope = 'own')
      if (effectiveScope === "own") {
        criticalCalcsQuery = criticalCalcsQuery.andWhere(
          "calc.userId = :userId"
        );
      }

      const criticalCalcs = await criticalCalcsQuery
        .setParameters(queryParams) // Set parameter yang sama
        .getCount();

      // ----------------------------------------------------
      // Kueri Aktivitas & User (Sama)
      // ----------------------------------------------------

      const totalUsers = await userRepo.count();
      const topUsers = await userRepo.find({
        /* ... */
      });
      const recentRegistrations = await userRepo.find({
        /* ... */
      });
      const recentCalculations = await calcRepo.find({
        /* ... */
      }); // Query ini tidak perlu where clause scoping

      // ====================================================================
      // 2. MAPPING & LOGIC
      // ====================================================================

      // ... (Logika mapping dan response sama) ...

      // ... (Logika mapping dan response sama) ...

      const roiAlert =
        avgRoi < 0
          ? `Peringatan: ROI rata-rata negatif (${avgRoi.toFixed(
              1
            )}%). Segera optimasi.`
          : `Rata-rata ROI sehat (${avgRoi.toFixed(
              1
            )}%). Pertimbangkan scaling.`;

      const formattedTopUsers = topUsers.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        avatarUrl: u.avatarUrl,
        role: u.roles[0]?.name || "No Role",
        createdAt: u.createdAt,
      }));

      const registrationActivities = recentRegistrations.map((u: any) => ({
        timestamp: u.createdAt,
        user: u.name,
        action: "registered to the platform.",
        when: dayjs(u.createdAt).fromNow(),
        color: "#3b82f6",
      }));

      const calculationActivities = recentCalculations.map((c: any) => {
        const userName = c.user?.name || "Anonymous User";
        const roi = toFloat(c.roiPercentage);

        return {
          timestamp: c.createdAt,
          user: userName,
          action: `ran a calculation (ROI: ${roi.toFixed(1)}%).`,
          when: dayjs(c.createdAt).fromNow(),
          color: roi >= 0 ? "#10b981" : "#ef4444",
        };
      });

      const allActivities = [
        ...registrationActivities,
        ...calculationActivities,
      ]
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
        systemTasks: [
          { task: "Approve 3 pending access requests", priority: "High" },
          { task: "Review 2 critical access changes", priority: "Medium" },
        ],
        topUsers: formattedTopUsers,
      };

      return NextResponse.json(dashboardData);
    }
  );
}
