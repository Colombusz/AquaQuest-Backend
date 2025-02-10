import express from "express";
import { connectDB } from "../config/db.js";
import loginRoutes from "../route/login_route.js";
import ai_routes from "../route/ai_route.js";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json()); 


app.use("/api/", loginRoutes);
app.use("/api", ai_routes);
app.listen(PORT, () => {
  connectDB();
  console.log("Server Started at http://localhost:" + PORT);
});