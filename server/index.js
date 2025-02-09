import express from "express";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.listen(PORT, () => {
  connectDB();
  console.log(`Server listening on ${PORT}`);
});