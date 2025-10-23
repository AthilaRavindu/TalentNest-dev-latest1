import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP expires in 5 minutes
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verifiedAt: {
        type: Date,
    },
    resetExpiry: {
        type: Date, // new field
    }
});

export const Otp = mongoose.model("Otp", otpSchema)