// script to add website field to mongo
import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../../models/userModel.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected for migration..."))
  .catch((err) => console.log(err));

const addWebsiteFieldToUsers = async () => {
  try {
    const result = await User.updateMany(
      { website: { $exists: false } },
      { $set: { website: "" } }
    );

    console.log(
      `Migration completed. ${result.modifiedCount} users updated with the 'website' field.`
    );
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    mongoose.disconnect();
  }
};

addWebsiteFieldToUsers();
