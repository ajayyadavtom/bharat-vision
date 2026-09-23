const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = "AQ.Ab8RN6JvFZ0lsLdd3Vpv6YB76fycOkTWtTnBRfQX5QeAB7WFoQ";
const genAI = new GoogleGenerativeAI(apiKey);
async function run() {
  const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro"];
  for (const m of models) {
    try {
      const model = genAI.getGenerativeModel({ model: m });
      const chat = model.startChat({ history: [] });
      const result = await chat.sendMessage("hello");
      console.log(`SUCCESS ${m}:`, result.response.text());
    } catch (e) {
      console.error(`FAIL ${m}:`, e.message);
    }
  }
}
run();
