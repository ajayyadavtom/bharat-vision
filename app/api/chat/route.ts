import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, imageBase64, cityId, appLang, history } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY || '';
    
    if (!apiKey) {
      return NextResponse.json({ reply: "Offline mode active. No API key." });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // DYNAMIC CONTEXT
    const currentTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
    let userCityName = cityId === "delhi" ? "Delhi NCR" : "Bengaluru";
    let primaryLanguage = cityId === "delhi" ? "Hindi" : "Kannada";

    // MASTER SYSTEM PROMPT with Learning & Search Instructions
    const systemInstruction = `You are Vanara AI, a highly advanced transit mastermind for 'Bharat Vision' in ${userCityName}. 
The current time is ${currentTime}. The local language is ${primaryLanguage}.

YOUR MISSION & CAPABILITIES:
1. AUTOMATIC LANGUAGE ENFORCEMENT: You MUST reply ENTIRELY in ${appLang === 'kn' ? 'Kannada' : appLang === 'hi' ? 'Hindi' : 'English'}. No matter what language the user speaks, translate your answer and provide the final response ONLY in ${appLang === 'kn' ? 'Kannada' : appLang === 'hi' ? 'Hindi' : 'English'}.
2. BE EXTREMELY BRIEF: Answer in 1 short sentence if possible. Maximum 2 sentences. Act like a casual, smart friend.
3. Formatting: Use minimal markdown. Do not write essays.
4. IMAGE GEOLOCATION & GOOGLE SEARCH: 
   - The user will upload images. You must analyze them closely.
   - Look for shop names, vendor boards, street signs, ads, or landmarks. 
   - You MUST cross-reference these names using your knowledge (or Google Search) to pinpoint their exact location in ${userCityName}.
5. STRICT ANTI-HALLUCINATION: If the image lacks recognizable text/signs, DO NOT GUESS randomly. Honestly say: "I can't clearly recognize this place from the image. Can you show me a shop board, street sign, or tell me where you are?"
6. CONTINUOUS LEARNING: If the user corrects you (e.g. "No, this is Yelahanka NES"), you MUST remember it for the rest of the conversation and apologize briefly, updating your internal knowledge. You have access to the chat history to remember these corrections.`;

    // Initialize model with System Instructions and Google Search Grounding
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-3.5-flash',
      
      systemInstruction,
// @ts-ignore
      tools: [{ googleSearch: {} }] // Enable dynamic internet searching!
    });

    const chat = model.startChat({
      history: history || [],
    });

    let result;
    const userPrompt = message || "Where am I based on this picture?";

    if (imageBase64) {
      const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
      const mimeType = imageBase64.match(/data:(image\/[a-zA-Z+.-]+);base64,/)?.[1] || "image/jpeg";
      
      result = await chat.sendMessage([
        userPrompt,
        {
          inlineData: {
            data: base64Data,
            mimeType
          }
        }
      ]);
    } else {
      result = await chat.sendMessage(userPrompt);
    }

    const reply = result.response.text();

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Vanara AI Engine Error:", error);
    return NextResponse.json({
      reply: "Namaskara! Namma servers are facing heavy traffic. Please try asking again in a moment."
    });
  }
}
