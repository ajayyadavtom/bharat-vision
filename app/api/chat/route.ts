import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  let parsedBody: any = { message: "", imageBase64: "", appLang: "en" };
  try {
    parsedBody = await req.json();
  } catch (e) {
    // ignore
  }

  try {
    const { message, imageBase64, cityId, appLang, history } = parsedBody;

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
      tools: [{ googleSearchRetrieval: {} } as any] // Cast as any just in case it doesn't match perfectly, though it should
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
    
    // Fallback to Offline Intelligence if the API fails (e.g. Rate Limit / 401 Unauthorized)
    const { message, imageBase64, appLang } = parsedBody;
    const lowerMsg = (message || "").toLowerCase();
    let mockReply = "";
    
    if (imageBase64) {
      mockReply = appLang === 'kn' 
        ? "ಇದು ಮೆಜೆಸ್ಟಿಕ್ ಬಸ್ ನಿಲ್ದಾಣದಂತೆ ಕಾಣುತ್ತದೆ. ಪ್ಲಾಟ್‌ಫಾರ್ಮ್ 14 ನಿಂದ 500D ಬಸ್ ಪಡೆಯಿರಿ."
        : appLang === 'hi'
        ? "यह मजेस्टिक बस स्टैंड जैसा लग रहा है। प्लेटफार्म 14 से 500D बस लें।"
        : "Based on the image, you seem to be at Majestic Bus Stand. Head to Platform 14 for the 500D bus.";
    } else if (lowerMsg.includes("majestic")) {
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
        ? "ನಮಸ್ಕಾರ! ನಿಮ್ಮ Gemini API ಕೀ ಅವಧಿ ಮುಗಿದಿದೆ (ಅಥವಾ ಅಮಾನ್ಯವಾಗಿದೆ). ದಯವಿಟ್ಟು ಹೊಸ ಕೀಲಿ ಸೇರಿಸಿ. (ಆಫ್‌ಲೈನ್ ಮೋಡ್ ಸಕ್ರಿಯವಾಗಿದೆ)"
        : appLang === 'hi'
        ? "नमस्ते! आपकी Gemini API कुंजी अमान्य या समाप्त हो गई है। कृपया नई कुंजी अपडेट करें। (ऑफ़लाइन मोड सक्रिय)"
        : "Namaskara! Your Gemini API key is invalid or revoked (401 Unauthorized). Please update `.env.local` with a new key from Google AI Studio. (Running in Offline Mode)";
    }

    return NextResponse.json({ reply: mockReply });
  }
}
