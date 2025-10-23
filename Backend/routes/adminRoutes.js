import express from "express";
const router = express.Router();
import {
  adminLogInController,
  createAdmin,
} from "../controllers/adminLogInController.js";

router.post("/admin-login", adminLogInController);
router.post("/admin-create", createAdmin);

export default router;
