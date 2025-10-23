import { sendOtpMailService } from "../services/sendOtpMailService.js";
import { Otp } from "../models/otp.js";
import bcrypt from 'bcryptjs';
import { User } from "../models/User.js";


{/* This controller sends an OTP email to the user for verification for forget password */}
export const sendOtpMailController = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const messageId = await sendOtpMailService(email, otp);
        res.status(200).json({ 
            message: "OTP email sent successfully",
            messageId: messageId
        });
    } catch (error) {
        console.error("Error sending OTP mail:", error);
        return res.status(500).json({
            message: "Failed to send OTP email",
            error: error.message,
        });
    }
}

{/* This controller verifies the OTP entered by the user for forget password */}
export const forgotPasswordOtpVerify = async (req, res) => {

    const { email, otp } = req.body;

    try {
        const record = await Otp.findOne( { email });
        if (!record) {
            return res.status(404).json({
                message: "OTP not found or expired. Please request a new one."
            });
        } else if (record.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP. Please try again."
            });
        } else if (record.otp === otp) {
            // OTP is valid, proceed with password reset logic here
            record.verified = true;
            record.verifiedAt = Date.now();
            record.resetExpiry = new Date(Date.now() + 5 * 60 * 1000); // fresh 5 min for reset
            await record.save();

            return res.status(200).json({
                message: "OTP verified successfully. You can now reset your password.",
                email: email // send back email to identify the user in the frontend
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to verify OTP",
            error: error.message,
        });
    }
}

export const resetPassword = async (req, res) => {
    // const { email, newPassword } = req.body;
    const workEmail = req.body.email
    const newPassword = req.body.newPassword

    try {
        const otpRecord = await Otp.findOne({ email: workEmail, verified: true });
        if (!otpRecord) {
            return res.status(404).json({
                message: "OTP not found or already expired. Please request a new one."
            });
        } else if (otpRecord.resetExpiry < Date.now()) {
            await Otp.deleteOne({ workEmail });
            return res.status(400).json({
                message: "OTP has expired. Please request a new one."
            });
        } else {
            // Update user password
            const hashedPassword = await bcrypt.hash(newPassword, 10);
            const user = await User.findOneAndUpdate({ workEmail }, { password: hashedPassword });
            if (!user) {
                return res.status(404).json({
                    message: "User not found."
                });
            }
            await Otp.deleteOne({ email: workEmail }); // delete otp record after successful reset
            return res.status(200).json({
                message: "Password reset successfully"
            });
        }
    } catch (error) {
        return res.status(500).json({
            message: "Failed to reset password",
            error: error.message,
        });
    }
}