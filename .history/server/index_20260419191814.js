import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5050;
app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  console.log("GET / hit");
  res.send("Server working");
});

// test POST (no Gemini yet)
app.post("/api/gemini", (req, res) => {
  console.log("POST /api/gemini hit");
  console.log("Body:", req.body);
  res.json({ text: "test ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});