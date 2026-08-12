import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({
        reply: "Vanara AI is in offline mode. GEMINI_API_KEY is not set in Vercel Environment Variables."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

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

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Vanara AI Engine Error:", error);
    return NextResponse.json({
      reply: "Namaskara! Namma servers are facing heavy traffic. Please try asking again in a moment."
    });
  }
}
