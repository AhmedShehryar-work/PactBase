import express from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";

import { getMyPacts, fulfillPact, makePact, searchPact } from "../controllers/pact.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const upload = multer();

const router = express.Router();

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute in ms
  max: 15, // max 15 requests per IP per minute
  message: { message: "Too many attempts, try again later" },
});

const makeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute in ms
  max: 3, // max 3 requests per IP per minute
  message: { message: "Too many attempts, try again later" },
});

router.get("/search-pact", upload.none(), searchLimiter, searchPact); // public
router.post("/make-pact", upload.none(), makeLimiter, protectRoute, makePact); // for LoggedIn users only
router.post("/fulfill", upload.none(), searchLimiter, protectRoute, fulfillPact);
router.get("/my-pacts", upload.none(), protectRoute, getMyPacts);
export default router;