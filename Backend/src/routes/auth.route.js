import express from "express";
import multer from "multer";

const upload = multer();

import { signup } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/signup", upload.none(), signup)

export default router;