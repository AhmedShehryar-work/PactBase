import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";

import { signup, login, check, logout } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const upload = multer();

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute in ms
  max: 6, // max 6 requests per IP
  message: { message: "Too many attempts, try again later" },
});

router.post("/signup", upload.none(), signup);
router.post("/login", upload.none(), authLimiter, login)
router.get("/check", protectRoute, check)
router.post("/logout",authLimiter, logout)

export default router;