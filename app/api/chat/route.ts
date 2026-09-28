import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let parsedBody: any = { message: "", imageBase64: "", appLang: "en" };
  try {
    parsedBody = await req.json();
  } catch (e) {
    // ignore
  }
  
  const apiKey = process.env.SARVAM_API_KEY || process.env.GEMINI_API_KEY || '';

  try {
    const { message, imageBase64, cityId, appLang, history } = parsedBody;
    
    if (!apiKey) {
      return NextResponse.json({ reply: "Offline mode active. No API key." });
    }

    // If an image is provided, Sarvam currently doesn't support vision directly in this endpoint.
    // Use the smart offline fallback for images.
    if (imageBase64) {
      const mockReply = appLang === 'kn' 
        ? "ಇದು ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣದಂತೆ ಕಾಣುತ್ತದೆ. ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 14 ನಿಂದ 500D ಬಸ್ ಪಡೆಯಿರಿ."
        : appLang === 'hi'
        ? "यह मजेस्टिक बस स्टैंड जैसा लग रहा है। प्लेटफार्म 14 से 500D बस लें।"
        : "Based on the image, you seem to be at Majestic Bus Stand. Head to Platform 14 for the 500D bus.";
      return NextResponse.json({ reply: mockReply });
    }

    // DYNAMIC CONTEXT
    const currentTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
    const userCityName = cityId === "delhi" ? "Delhi NCR" : "Bengaluru";
    const primaryLanguage = cityId === "delhi" ? "Hindi" : "Kannada";

    const systemInstruction = `You are Vanara AI, a highly advanced transit mastermind for 'Bharat Vision' in ${userCityName}. 
The current time is ${currentTime}. The local language is ${primaryLanguage}.

YOUR MISSION & CAPABILITIES:
1. AUTOMATIC LANGUAGE ENFORCEMENT: You MUST reply ENTIRELY in ${appLang === 'kn' ? 'Kannada' : appLang === 'hi' ? 'Hindi' : 'English'}. No matter what language the user speaks, translate your answer and provide the final response ONLY in ${appLang === 'kn' ? 'Kannada' : appLang === 'hi' ? 'Hindi' : 'English'}.
2. BE EXTREMELY BRIEF: Answer in 1 short sentence if possible. Maximum 2 sentences. Act like a casual, smart friend.
3. CONTINUOUS LEARNING: If the user corrects you, apologize briefly and update your knowledge.`;

    // Map history to OpenAI format
    const messages = [
      { role: "system", content: systemInstruction },
      ...(history || []).map((m: any) => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts[0].text
      })),
      { role: "user", content: message || "Hello" }
    ];

    const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey
      },
      body: JSON.stringify({
        model: "sarvam-105b",
        messages: messages,
        temperature: 0.5
      })
    });

    if (!response.ok) {
      throw new Error(`Sarvam API Error: ${response.status}`);
    }

    const data = await response.json();
    const reply = data.choices[0].message.content;

    return NextResponse.json({ reply });

  } catch (error: any) {
    console.error("Vanara AI Engine Error:", error);
    
    // Fallback to Offline Intelligence if the API fails
    const { message, appLang } = parsedBody;
    const lowerMsg = (message || "").toLowerCase();
    let mockReply = "";
    
    if (lowerMsg.includes("majestic")) {
      mockReply = appLang === 'kn' 
        ? "ಮೆಜೆಸ್ಟಿಕ್ ತಲುಪಲು, ನೀವು ಹತ್ತಿರದ ಮೆಟ್ರೋ ನಿಲ್ದಾಣದಿಂದ ಪರ್ಪಲ್ ಲೈನ್ (Purple Line) ತೆಗೆದುಕೊಳ್ಳಬಹುದು, ಅಥವಾ 250, 276, 280 ಬಸ್‌ಗಳನ್ನು ಹತ್ತಬಹುದು. ಟಿಕೆಟ್ ಬೆಲೆ ಸುಮಾರು ₹25."
        : appLang === 'hi'
        ? "मजेस्टिक पहुंचने के लिए, आप निकटतम मेट्रो स्टेशन से पर्पल लाइन ले सकते हैं, या 250, 276, 280 बसें ले सकते हैं। टिकट की कीमत लगभग ₹25 है।"
        : "To reach Majestic, you can take the Purple Line from the nearest metro station, or board buses 250, 276, or 280. The fare is approximately ₹25.";
    } else if (lowerMsg.includes("time") || lowerMsg.includes("late")) {
      mockReply = appLang === 'kn'
        ? "ಟ್ರಾಫಿಕ್ ದಟ್ಟಣೆಯಿಂದಾಗಿ 500D ಬಸ್ 15 ನಿಮಿಷ ವಿಳಂಬವಾಗಿದೆ. ದಯವಿಟ್ಟು ಲೈವ್ ಮ್ಯಾಪ್‌ನಲ್ಲಿ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ."
        : appLang === 'hi'
        ? "ट्रैफिक जाम के कारण 500D बस 15 मिनट लेट है। कृपया लाइव मैप पर ट्रैक करें।"
        : "The 500D bus is delayed by 15 minutes due to heavy traffic on the Ring Road. Please check the Live Map for exact tracking.";
    } else {
      mockReply = appLang === 'kn'
        ? "ನಮಸ್ಕಾರ! ನಿಮ್ಮ API ಕೀ ಅಮಾನ್ಯವಾಗಿದೆ ಅಥವಾ ಮುಕ್ತಾಯಗೊಂಡಿದೆ. (ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ)"
        : appLang === 'hi'
        ? "नमस्ते! आपकी API कुंजी अमान्य है। (ऑफ़लाइन मोड सक्रिय)"
        : "Namaskara! Your AI API key seems to be invalid or timed out. (Running in Offline Mode)";
    }

    return NextResponse.json({ reply: mockReply });
  }
}
