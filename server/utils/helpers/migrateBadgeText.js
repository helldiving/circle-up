// script to add badgetext field to mongo

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../models/userModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for migration..."))
  .catch((err) => console.log(err));

const migrateBadgeText = async () => {
  try {
    const result = await User.updateMany(
      { badgeText: { $exists: false } },
      { $set: { badgeText: "" } }
    );

    console.log(`Migration completed. ${result.modifiedCount} users updated.`);
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.disconnect();
  }
};

migrateBadgeText();
