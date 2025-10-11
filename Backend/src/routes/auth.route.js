import express from "express";
import rateLimit from "express-rate-limit";

import signupUpload from "../middleware/signupUpload.js";
import { signup, login, check, logout } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

const logInAndOutLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute in ms
  max: 6, // max 6 requests per IP per minute
  message: { message: "Too many attempts, try again later" },
});

const signupLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 day in ms
  max: 3, // max 3 requests per IP per day
  message: { message: "Too many attempts, try again later" },
});

router.post("/signup", signupLimiter, signupUpload, signup);
router.post("/login", logInAndOutLimiter, login)
router.get("/check", protectRoute, check)
router.post("/logout", logInAndOutLimiter, logout)

export default router;