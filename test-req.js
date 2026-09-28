fetch("http://localhost:3005/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message: "test", history: [{role: "user", parts: [{text: "hello"}]}] })
}).then(r => r.json()).then(console.log).catch(console.error);
