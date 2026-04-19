import express from "express";

const app = express();
app.use(express.json());

app.post("/api/gemini", (req, res) => {
  console.log("🔥 THIS IS MY SERVER");
  res.json({ msg: "YOU ARE NOW HITTING THIS FILE" });
});

app.listen(5050, () => {
  console.log("🚀 TEST SERVER RUNNING");
});