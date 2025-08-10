import express from "express";

import { activate, disable } from "../controllers/admin/status.controller.js";

const router = express.Router();

router.post("/activate", activate);
router.post("/disable", disable);

export default router;