import express from "express";
import {
  sendOtp,
  verifyOtp,
  getPassword,
} from "../controllers/otpController.js";

const router = express.Router();

// Add logging to verify routes are loaded
console.log('📝 Loading OTP routes...');

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
router.get("/get-password", getPassword);

console.log('✅ OTP routes loaded successfully');

export default router;