import express from "express";

import { getUser, activate, disable, reject } from "../controllers/admin/status.controller.js";

const router = express.Router();

router.post("/user", getUser);
router.patch("/activate", activate);
router.patch("/disable", disable);
router.patch("/reject", reject);

export default router;