import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getUserProfile,
  getUsers,
  getUserReplies,
} from "../controllers/userController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

router.get("/profile/:query", getUserProfile);
router.post("/signup", signupUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/follow/:id", protectRoute, followUnFollowUser); // toggles state(follow/unfollow) //:id value is dynamic
router.put("/update/:id", protectRoute, updateUser);
router.get("/all", getUsers);
router.get("/replies/:username", getUserReplies);

export default router;
