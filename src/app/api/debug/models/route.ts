import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "API Key belum diset di .env" },
        { status: 500 }
      );
    }

    // Tembak endpoint List Models
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      { method: "GET" }
    );

    const data = await response.json();

    // Kita filter hanya model yang bisa "generateContent"
    const availableModels = data.models
      ?.filter((m: any) =>
        m.supportedGenerationMethods.includes("generateContent")
      )
      .map((m: any) => m.name); // output: models/gemini-pro, models/gemini-1.5-flash, dll

    return NextResponse.json({
      count: availableModels?.length,
      models: availableModels,
      fullResponse: data,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
