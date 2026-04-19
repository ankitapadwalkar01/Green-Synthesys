import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 5050;



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});