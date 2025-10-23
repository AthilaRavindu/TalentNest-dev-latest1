import mongoose from "mongoose";

const tempOtpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
});

export default mongoose.model("TempOtp", tempOtpSchema);
