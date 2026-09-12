import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, cityId } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || '';
    
    if (!apiKey) {
      return NextResponse.json({
        reply: "Vanara AI is in offline mode. GEMINI_API_KEY is not set in Vercel Environment Variables."
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

    // 1. DYNAMIC CONTEXT: Giving the AI the real-world time and the user's active city
    const currentTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    // Resolve city data
    let userCityName = "Bengaluru";
    let primaryLanguage = "Kannada";
    if (cityId === "delhi") {
        userCityName = "Delhi NCR";
        primaryLanguage = "Hindi";
    }

    // 2. THE MASTER PROMPT: Unleashing Gemini's true intelligence with language auto-detection
    const prompt = `You are Vanara AI, a highly advanced transit mastermind for the 'Bharat Vision' app in ${userCityName}. 
    The current time is ${currentTime}. The local language is ${primaryLanguage}.

    YOUR MISSION:
    1. AUTOMATIC LANGUAGE DETECTION: You MUST reply in the exact language the user speaks to you (e.g., if they speak Hindi, reply in Hindi. If they speak English/Kanglish, reply in that). If ambiguous, default to a friendly mix of English and the local language (${primaryLanguage}).
    2. Be deeply intelligent. When asked for routes in ${userCityName}, give structured, step-by-step instructions (Exact Bus numbers, Metro lines, estimated fares, and transfer points).
    3. When asked about traffic or delays, explain the actual geographic reasons for ${userCityName}.
    4. Format your response beautifully using emojis, clean line breaks, and lists. (Do NOT use Markdown asterisks like **bold**, as our UI is plain text).
    
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
