import express from "express";
const router = express.Router();

router.post("/chat", async (req, res) => {
  const { message, history } = req.body;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          { role: "system", content: "You are a helpful skill-exchange assistant. Help users find learning partners, suggest skills to learn, and give learning advice. Be friendly and concise." },
          ...(history || []),
          { role: "user", content: message }
        ],
        max_tokens: 500
      })
    });
    const data = await response.json();
    res.json({ reply: data.choices[0].message.content });
  } catch (err) {
    res.status(500).json({ error: "AI error" });
  }
});

export default router;
