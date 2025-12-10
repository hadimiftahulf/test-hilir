import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { withAuth } from "@/server/lib/api-wrapper";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: any;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error: any) {
      lastError = error;

      if (error?.status === 429) {
        const retryAfter = error?.errorDetails?.find((d: any) =>
          d["@type"]?.includes("RetryInfo")
        )?.retryDelay;

        const delayMs = retryAfter
          ? parseFloat(retryAfter) * 1000
          : baseDelay * Math.pow(2, i);

        console.log(`Rate limited. Retrying after ${delayMs}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

export async function POST(req: NextRequest) {
  return withAuth(req, null, async (user, _scope, request) => {
    try {
      const body = await request.json();
      const { adSpend, cpr, aov, roi, profit } = body;

      const model = genAI.getGenerativeModel({
        model: "gemini-2.5-flash-lite",
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.7,
        },
      });

      const fmt = (n: number) =>
        new Intl.NumberFormat("id-ID", {
          style: "currency",
          currency: "IDR",
          maximumFractionDigits: 0,
        }).format(n);

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
          "health_score": (Number 0-100), 
          "risk_level": "Low" | "Medium" | "High", 
          "status_title": "String pendek (maks 5 kata) yang menggambarkan kondisi",
          "executive_summary": "String (1 paragraf ringkas, nada profesional)",
          "action_plan": [
            {
              "type": "Scaling" | "Fixing" | "Kill", 
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

      const result = await retryWithBackoff(
        () => model.generateContent(prompt),
        3,
        1000
      );

      const response = result.response;
      const text = response.text();
      const data = JSON.parse(text);

      return NextResponse.json({
        success: true,
        data: data,
      });
    } catch (error: any) {
      console.error("Gemini AI Error:", error);

      if (error?.status === 429) {
        return NextResponse.json(
          {
            error: "Rate Limit Exceeded",
            details:
              "Quota API Gemini habis. Mohon coba lagi nanti atau upgrade ke paid plan.",
            retryAfter:
              error?.errorDetails?.find((d: any) =>
                d["@type"]?.includes("RetryInfo")
              )?.retryDelay || "1 menit",
          },
          { status: 429 }
        );
      }

      const errorMessage = error?.message || "Terjadi kesalahan analisis.";

      return NextResponse.json(
        { error: "AI Service Error", details: errorMessage },
        { status: 500 }
      );
    }
  });
}
