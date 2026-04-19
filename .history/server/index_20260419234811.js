import express from "express";

const app = express();
app.use(express.json());

app.post("/api/gemini", (req, res) => {
  console.log("🔥🔥🔥 THIS IS DEFINITELY NEW CODE");
  res.json({ text: "NEW CODE ACTIVE" });
});

app.listen(5050, () => {
  console.log("🚀 NEW SERVER RUNNING");
}