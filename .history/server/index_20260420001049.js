import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

console.log("OPENAI KEY:", process.env.OPENAI_API_KEY);

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/gemini", async (req, res) => {
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
    console.error("🔥 FULL ERROR:", err);
    res.status(500).json({ error: err.message });
  }