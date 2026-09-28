const fs = require('fs');

async function testSequence() {
  console.log("1. Sending image message...");
  const imgRes = await fetch("http://localhost:3005/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "Where am I?",
      imageBase64: "data:image/jpeg;base64,AAAA",
      appLang: "en",
      history: []
    })
  });
  console.log("Image Status:", imgRes.status);
  console.log("Image Reply:", await imgRes.json());

  console.log("\n2. Sending text message after image...");
  const txtRes = await fetch("http://localhost:3005/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "What is 2+2?",
      appLang: "en",
      history: [
        { role: "user", parts: [{ text: "Where am I?" }] },
        { role: "model", parts: [{ text: "Based on the image, you seem to be at Majestic Bus Stand." }] }
      ]
    })
  });
  console.log("Text Status:", txtRes.status);
  try {
    console.log("Text Reply:", await txtRes.json());
  } catch (e) {
    console.log("Text Error:", e.message);
  }
}

testSequence();
