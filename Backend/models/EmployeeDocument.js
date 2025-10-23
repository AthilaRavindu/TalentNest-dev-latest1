import mongoose from "mongoose";

const EmployeeDocumentSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doc_type_id: { type: mongoose.Schema.Types.ObjectId, ref: "DocumentType", required: true },
  document_number: { type: String },
  issue_date: { type: Date },
  expiry_date: { type: Date },
  document_url: { type: String },
  verification_date: { type: Date },
  verified_by_user_id: { type: String },
  uploaded_by_user_id: { type: String },
  status: { type: String },
  verification_notes: { type: String }
}, { timestamps: true });

export default mongoose.model("EmployeeDocument", EmployeeDocumentSchema);
