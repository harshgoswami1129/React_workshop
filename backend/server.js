import express from "express";
import process from "node:process";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import registerRoutes from "./routes/registerRoutes.js";


dotenv.config();


import connectDB from "./config/database.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// import authRoutes from './routes/authRoutes.js';
const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


 app.use("/api/", registerRoutes);


app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Connect to MongoDB
connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to MongoDB:", error);
    process.exit(1);
  });
