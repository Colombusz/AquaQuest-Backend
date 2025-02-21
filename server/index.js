import express from "express";
import { connectDB } from "../config/db.js";
import dotenv from "dotenv";
import cloudinary from "cloudinary";


dotenv.config();
const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json()); 

  

// IMPORT ROUTES
import userRoutes from "../route/user.js";
import waterBillRoutes from "../route/waterBill.js"



// USE ROUTES
app.use("/api", userRoutes);
app.use("/api/waterBill", waterBillRoutes);



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