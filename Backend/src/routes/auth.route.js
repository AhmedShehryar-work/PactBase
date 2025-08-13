import express from "express";
import multer from "multer";

const upload = multer();

import { signup, login } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", upload.none(), signup);
router.post("/login", upload.none(), login)

export default router;