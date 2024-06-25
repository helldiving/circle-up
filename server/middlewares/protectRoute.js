import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const protectRoute = async (req, res, next) => {
  try {
    // Get the JWT token from the cookies
    const token = req.cookies.jwt;

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    // Verify the token and extract the user ID from the payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the extracted user ID
    const user = await User.findById(decoded.userId).select("-password");

    // we take token -> if no token -> no one is logged in -> "unauthorized"
    // we take token -> if token -> try to verify it and get userid from payload -> try to find user from database -> if user exists -> successful -> inside the req object, req.user = user will call user -> then call next function which is followUnFollowUser

    // userId is the payload from generateTokenandSetCookie

    // Attach the user object to the request for further use
    req.user = user;

    next();
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log("Error in signupUser: ", err.message);
  }
};

export default protectRoute;
