import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";

import { searchPact } from "../controllers/pact.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const upload = multer();

const router = express.Router();

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute in ms
  max: 60, // max 60 (for testing) requests per IP per minute
  message: { message: "Too many attempts, try again later" },
});

router.get("/searchpact", upload.none(), searchLimiter, searchPact);

export default router;