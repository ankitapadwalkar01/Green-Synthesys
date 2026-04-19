import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/gemini", async (req, res) => {
  console.log("🔥 OpenAI route hit");

  try {
    const { prompt } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a nanotechnology synthesis expert." },
        { role: "user", content: prompt }
      ],
    });

    const text = completion.choices[0].message.content;

    res.json({ text });

  } catch (err) {
  console.error("🔥 FULL ERROR:", err);   // prints real error in terminal
  res.status(500).json({ error: err.message });  // sends real error to curl
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});