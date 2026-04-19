import express from "express";

const app = express();
app.use(express.json());

app.post("/api/gemini", (req, res) => {
  console.log("🔥 NEW SERVER WORKING");
  res.json({ text: "WORKING" });
});

app.listen(5050, () => {
  console.log("🚀 NEW SERVER RUNNING");
});