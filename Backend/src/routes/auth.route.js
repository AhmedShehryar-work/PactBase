import express from "express";
import multer from "multer";

const upload = multer();

import { signup, login, check } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", upload.none(), signup);
router.post("/login", upload.none(), login)
router.get("/check", upload.none(), check)

export default router;