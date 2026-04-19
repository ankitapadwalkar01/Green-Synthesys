import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

/* ✅ ADD THIS RIGHT HERE */
app.get("/", (req, res) => {
  res.send("Server working");
});

app.post("/api/gemini", async (req, res) => {
  console.log("✅ Request hit");

  try {
    const { prompt } = req.body;

    console.log("PROMPT:", prompt);
    console.log("API KEY:", process.env.GEMINI_API_KEY);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
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

    return res.json(data);
  } catch (err) {
    console.error("❌ ERROR:", err);
    return res.status(500).json({ error: "Backend error" });
  }
});

