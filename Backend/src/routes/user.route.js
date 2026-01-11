import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";

import { getUser, changePassword, verifyEmail } from "../controllers/user.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const upload = multer();

const router = express.Router();

const majorActionsLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours in ms
  max: 1, // max 1 request per IP per day
  message: { message: "Too many attempts, try again later" },
});

router.post("/verify-email", upload.none(), majorActionsLimiter, protectRoute, verifyEmail); // for LoggedIn users only
router.post("/change-password", upload.none(), majorActionsLimiter, protectRoute, changePassword);
router.get("/get-user", upload.none(), getUser);

export default router;