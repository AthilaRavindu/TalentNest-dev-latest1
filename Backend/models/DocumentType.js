import mongoose from "mongoose";

const DocumentTypeSchema = new mongoose.Schema({
  document_name: { type: String, required: true },
  description: { type: String },
  document_category: { type: String },
  is_mandatory_for_onboarding: { type: Boolean, default: false },
  is_recurring: { type: Boolean, default: false },
  validity_period_months: { type: Number },
  is_active: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model("DocumentType", DocumentTypeSchema);
