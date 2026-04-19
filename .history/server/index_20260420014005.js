import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});
app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body; // ✅ THIS LINE WAS MISSING

    const response = await fetch(
      
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

    const text =
      data?.candidates?.[0]?.content?.parts
        ?.map(p => p.text)
        ?.join("") || JSON.stringify(data);

    res.json({ text });

  } catch (err) {
    console.error("🔥 ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});