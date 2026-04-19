import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("KEY:", process.env.GEMINI_API_KEY);
console.log("RUNNING FILE:", import.meta.url);

const app = express();
const PORT = 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server working");
});

app.post("/api/gemini", async (req, res) => {
  console.log("✅ Request hit");

  try {
    const { prompt } = req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI RESPONSE:", data);

    res.json(data);
  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({ error: "Backend error" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});