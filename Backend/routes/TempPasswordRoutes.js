// routes/otpRoutes.js
import express from 'express';
import { sendCredentials, verifyOTP, changePassword } from '../controllers/otpController.js';

const router = express.Router();

// These routes will be prefixed with /api/otp
router.post('/send-credentials', sendCredentials);  // Full path: /api/otp/send-credentials
router.post('/verify-otp', verifyOTP);              // Full path: /api/otp/verify-otp
router.post('/change-password', changePassword);    // Full path: /api/otp/change-password

export default router;