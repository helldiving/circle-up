// add instagram field to mongo

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../models/userModel.js";

console.log("Script started");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for migration..."))
  .catch((err) => console.log("Error connecting to MongoDB:", err));

const addInstagramFieldMigration = async () => {
  try {
    const count = await User.countDocuments({ instagram: { $exists: false } });
    console.log(`Found ${count} users without the 'instagram' field.`);

    if (count === 0) {
      console.log(
        "All users already have the instagram field. No updates needed."
      );
      return;
    }

    const result = await User.updateMany(
      { instagram: { $exists: false } },
      { $set: { instagram: "" } }
    );

    console.log(
      `Migration completed. ${result.modifiedCount} users updated with the 'instagram' field.`
    );
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.disconnect();
  }
};

addInstagramFieldMigration();
