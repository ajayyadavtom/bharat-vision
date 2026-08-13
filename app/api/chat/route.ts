import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const SAFE_FALLBACK_REPLY = JSON.stringify({
  status: "offline",
  message: "Namaskara! Vanara AI is temporarily unavailable. Please try again shortly.",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    const apiKey = process.env.GEMINI_API_KEY;

    if (!message) {
      return NextResponse.json({ reply: "Please share your route query so I can help." }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ reply: SAFE_FALLBACK_REPLY });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const currentTime = new Date().toLocaleTimeString("en-IN", { timeZone: "Asia/Kolkata" });

    const prompt = `You are Vanara AI, a highly advanced transit assistant for the 'Bharat Vision' app in Bengaluru.

The current time in Bengaluru is ${currentTime}.

YOUR RULES:
1. Give structured, step-by-step route instructions (exact BMTC bus numbers like 500D or 335E, Namma Metro lines, estimated fares, transfer points).
2. When asked about traffic, explain actual geographic reasons (Silk Board choke points, ORR tech park shifts, Peenya bottlenecks).
3. Use emojis and clean line breaks. Do NOT use markdown asterisks like **bold**.
4. Keep your authentic Bengaluru flavor (maga, guru, macha, Namaskara) but be a true local mobility expert.

User says: ${message}`;

    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    return NextResponse.json({ reply: reply || SAFE_FALLBACK_REPLY });

  } catch (error: any) {
    console.error("Vanara AI Engine Error:", error);
    return NextResponse.json({ reply: SAFE_FALLBACK_REPLY });
  }
}
