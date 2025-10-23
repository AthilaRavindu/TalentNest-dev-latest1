import express from 'express';
import { forgotPasswordOtpVerify, resetPassword, sendOtpMailController } from '../controllers/authController.js';
import { otpGenerateAndStoreDb } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/forgot-password/send-otp-mail', otpGenerateAndStoreDb, sendOtpMailController);
router.post('/forgot-password/verify-otp', forgotPasswordOtpVerify);
router.post('/reset-password', resetPassword);
router.post('/forgot-password/resend-otp', otpGenerateAndStoreDb, sendOtpMailController);

export default router;