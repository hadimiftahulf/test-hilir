import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withAuth } from "@/server/lib/api-wrapper"; // Pastikan path wrapper benar

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: NextRequest) {
  // Gunakan Wrapper Auth agar aman
  return withAuth(req, null, async (user, request) => {
    try {
      const body = await request.json();
      const { adSpend, cpr, aov, roi, profit } = body;

      // 1. Setup Model (Pilih yang paling Cerdas & Cepat dari list Anda)
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json", // Paksa output JSON murni
          temperature: 0.7, // Kreatif tapi tetap terarah
        },
      });

      // 2. Format Angka untuk Konteks AI
      const fmt = (n: number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(n);

      // 3. Advanced Prompt Engineering (Persona: Elite Consultant)
      const prompt = `
        Berperanlah sebagai 'Elite Digital Marketing Strategist' dengan pengalaman 15 tahun.
        Lakukan audit mendalam terhadap performa kampanye iklan berikut:

        DATA METRIK:
        - Budget Iklan (Ad Spend): ${fmt(adSpend)}
        - Cost per Result (CPR): ${fmt(cpr)}
        - Average Order Value (AOV): ${fmt(aov)}
        - Profit Bersih: ${fmt(profit)}
        - ROI (Return on Investment): ${roi.toFixed(2)}%

        TUGAS ANALISIS:
        Berikan output JSON dengan struktur dan kriteria berikut:

        {
          "health_score": (Number 0-100), // Nilai kesehatan kampanye
          "risk_level": "Low" | "Medium" | "High", // Tingkat risiko boncos
          "status_title": "String pendek (maks 5 kata) yang menggambarkan kondisi",
          "executive_summary": "String (1 paragraf ringkas, nada profesional)",
          "action_plan": [
            {
              "type": "Scaling" | "Fixing" | "Kill", // Jenis tindakan
              "title": "Judul Tindakan",
              "description": "Penjelasan teknis singkat apa yang harus dilakukan"
            },
            {
              "type": "Optimization",
              "title": "Judul Tindakan",
              "description": "Penjelasan teknis singkat"
            }
          ]
        }

        PENTING:
        - Gunakan Bahasa Indonesia profesional (Business Level).
        - Jika ROI Negatif, fokus pada penurunan CPR atau kenaikan AOV.
        - Jika ROI Positif (>20%), fokus pada strategi Scaling (menambah budget).
        - Berikan "health_score" yang logis berdasarkan ROI.
      `;

      // 4. Eksekusi AI
      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      // 5. Parse Hasil
      const data = JSON.parse(text);

      return NextResponse.json({
        success: true,
        data: data,
      });
    } catch (error: any) {
      console.error("Gemini AI Error:", error);

      const errorMessage = error?.message || "Terjadi kesalahan analisis.";

      return NextResponse.json(
        { error: "AI Service Error", details: errorMessage },
        { status: 500 }
      );
    }
  });
}
