import mongoose from "mongoose";
import dotenv from "dotenv";
import Post from "../../models/postModel.js"; // adjust the path as needed

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const updateRepliesCreatedAt = async () => {
  try {
    const result = await Post.updateMany(
      { "replies.createdAt": { $exists: false } },
      { $set: { "replies.$[].createdAt": new Date() } }
    );
    console.log(`Updated ${result.modifiedCount} documents`);
  } catch (error) {
    console.error("Error updating documents:", error);
  } finally {
    mongoose.disconnect();
  }
};

updateRepliesCreatedAt();
