import express from "express";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";
import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();


app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: false, 
  })
);

app.use(express.static('public'));
app.use(cors()); // Enable CORS for all origins
app.use(express.json()); 

// IMPORT ROUTES
import userRoutes from "../route/user.js";
import waterBillRoutes from "../route/waterBill.js";
import chartAnalyticsRoutes from "../route/chartAnalytics.js";
import adminRoutes from "../route/admin.js";
import pdfRoutes from "../route/pdf.js";

// USE ROUTES
app.use("/api", userRoutes);
app.use("/api/waterBill", waterBillRoutes);
app.use("/api/chart", chartAnalyticsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pdf", pdfRoutes);
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   next();
// });


cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.listen(PORT, () => {
  connectDB();
  console.log("Server Started at http://localhost:" + PORT);
});


// app.get("/api/env", (req, res) => {
//   res.json({
//     MONGO_URI: process.env.MONGO_URI,
//     PORT: process.env.PORT,
//     JWT_SECRET: process.env.JWT_SECRET,
//     JWT_EXPIRES_TIME: process.env.JWT_EXPIRES_TIME,
//     CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
//     CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
//     CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
//   });
// });