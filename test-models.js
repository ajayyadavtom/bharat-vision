const { GoogleGenerativeAI } = require(@google/generative-ai);
const apiKey = AQ.Ab8RN6JvFZ0lsLdd3Vpv6YB76fycOkTWtTnBRfQX5QeAB7WFoQ;
const genAI = new GoogleGenerativeAI(apiKey);
async function run() {
  const model = genAI.getGenerativeModel({ model: gemini-3.6-flash });
  try {
    const result = await model.generateContent(hello);
    console.log(SUCCESS:, result.response.text());
  } catch (e) {
    console.error(FAIL:, e.message);
  }
}
run();
