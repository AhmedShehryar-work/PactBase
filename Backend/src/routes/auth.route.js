import express from "express";
import multer from "multer";

import { signup, login, check } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const upload = multer();

const router = express.Router();

router.post("/signup", upload.none(), signup);
router.post("/login", upload.none(), login)
router.get("/check", upload.none(), protectRoute, check)

export default router;