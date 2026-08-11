import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || '';
    const genAI = new GoogleGenerativeAI(apiKey);
    
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    // 1. DYNAMIC CONTEXT: Giving the AI the real-world time so it gives time-accurate answers!
    const currentTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });

    // 2. THE MASTER PROMPT: Unleashing Gemini's true intelligence
    const prompt = `You are Vanara AI, a highly advanced transit mastermind for the 'Bharat Vision' app in Bengaluru. 
    The current time in Bengaluru is ${currentTime}.

    YOUR MISSION:
    1. Be deeply intelligent. When asked for routes, give structured, step-by-step instructions (Exact BMTC Bus numbers like 500D or 335E, Namma Metro lines, estimated fares, and transfer points).
    2. When asked about traffic or delays, explain the actual geographic reasons (e.g., "ORR tech park shifts", "Silk Board choke points", "Peenya bottlenecks").
    3. Format your response beautifully using emojis, clean line breaks, and lists. (Do NOT use Markdown asterisks like **bold**, as our UI is plain text).
    4. Keep your authentic Bengaluru flavor (maga, guru, macha, swami, Namaskara) but act like a true local mobility expert, not just a simple chatbot.
    
    User says: ${message}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
    
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { reply: `Google API Error: ${error.message}` }, 
      { status: 500 }
    );
  }
}