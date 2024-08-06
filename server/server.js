import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

// Connect to MongoDB
connectDB();
const app = express(); // express server

const PORT = process.env.PORT || 5000;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json({ limit: "100mb" })); // Parse JSON data in the request body
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data in the request body
app.use(cookieParser()); // Parse cookies

// Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Server is running" });
});

// Start the server
app.listen(PORT, () =>
  console.log(`Server started at http://localhost:${PORT}`)
);
