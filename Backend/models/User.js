import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    // ==================== BASIC INFORMATION ====================
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    fullName: { type: String, required: true },
    userId: { type: String, required: true },
    username: { type: String, required: true },
    NIC: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    role: {
      type: String,
      default: "Employee",
    },
    systemRole: {
      type: String,
      default: "Employee",
    },

    permissions: {
      type: String,
      default: "Employee Permission",
    },
    leavePolicy: {
      type: String,
      default: "",
    },
    leaveBalance: {
      type: Number,
      default: 0,
    },

    // ==================== CONTACT INFORMATION ====================
    workEmail: { type: String, required: true, unique: true },
    personalPhoneNumber: { type: String },
    whatsappPhoneNumber: { type: String },

    // ==================== PERSONAL DETAILS ====================
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    maritalStatus: {
      type: String,
      enum: ["single", "married", "divorced", "widowed"],
    },
    nationality: { type: String },
    passportNumber: { type: String },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    religion: { type: String },

    // ==================== ADDRESS INFORMATION ====================
    currentAddress: {
      addressLine: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
    },
    permanentAddress: {
      addressLine: { type: String },
      city: { type: String },
      province: { type: String },
      postalCode: { type: String },
    },

    // ==================== SOCIAL MEDIA ====================
    socialMediaLinks: {
      linkedinProfile: { type: String },
      facebookProfile: { type: String },
    },

    // ==================== EMPLOYMENT INFORMATION ====================
    department: { type: String },
    position: { type: String },
    managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Manager ID
    workLocation: { type: String },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "intern", "contract"],
    },
    employmentStatus: {
      type: String,
      enum: ["active", "inactive", "terminated", "pending"],
      default: "inactive",
    },
    hireDate: { type: Date },
    terminationDate: { type: Date },
    workingHours: { type: String }, // e.g., "9:00 AM - 5:00 PM"
    basicSalary: { type: Number },

    // ==================== BIOMETRIC DATA ====================
    biometrics: {
      fingerprint: { type: String },
      faceId: { type: String },
    },

    // ==================== EMERGENCY CONTACT ====================
    emergencyContact: {
      name: { type: String },
      phoneNumber: { type: String },
      relationship: { type: String },
    },

    // ==================== PASSWORD MANAGEMENT ====================
    forcePasswordChange: {
      type: Boolean,
      default: true,
    },
    lastPasswordChange: {
      type: Date,
      default: Date.now,
    },

    // ==================== LEGACY REFERENCES (COMMENTED) ====================
    // groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" }, // FK:Group_ID
    // departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" }, // FK:Department_ID
    // positionId: { type: mongoose.Schema.Types.ObjectId, ref: "Position" }, // FK:Position_ID
  },
  { timestamps: true }
);

// export default mongoose.model("User", UserSchema);
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
export { User };
