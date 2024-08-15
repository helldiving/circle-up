import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../../models/postModel.js";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Current directory:", __dirname);

const envPath = path.resolve(__dirname, ".env");
console.log("Env file path:", envPath);

if (fs.existsSync(envPath)) {
  console.log(".env file exists");
  const envContent = fs.readFileSync(envPath, "utf8");
  console.log(".env file content:", envContent);
  dotenv.config({ path: envPath });
} else {
  console.log(".env file does not exist");
}

console.log("MONGO_URI:", process.env.MONGO_URI);

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is not defined in the environment variables");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for migration..."))
  .catch((err) => {
    console.log("MongoDB connection error:", err);
    process.exit(1);
  });

const addTimestampsMigration = async () => {
  try {
    const currentDate = new Date();

    // Update posts without createdAt
    const postsUpdateResult = await Post.updateMany(
      { createdAt: { $exists: false } },
      { $set: { createdAt: currentDate } }
    );

    console.log(
      `Updated ${postsUpdateResult.modifiedCount} posts with createdAt`
    );

    // Update replies without createdAt
    const repliesUpdateResult = await Post.updateMany(
      { "replies.createdAt": { $exists: false } },
      { $set: { "replies.$[].createdAt": currentDate } }
    );

    console.log(
      `Updated replies in ${repliesUpdateResult.modifiedCount} posts`
    );

    console.log("Migration completed successfully");
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
};

addTimestampsMigration();
