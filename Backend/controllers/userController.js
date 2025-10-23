import User from "../models/User.js";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

/**
 * Create a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const createUser = async (req, res) => {
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          required: ["firstName", "lastName", "fullName", "userId", "workEmail", "username", "NIC", "password"],
          properties: {
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            fullName: { type: "string", example: "John Doe" },
            userId: { type: "string", example: "EMP001" },
            username: { type: "string", example: "johndoe123" },
            NIC: { type: "string", example: "123456789V" },
            password: { type: "string", example: "securePassword123" },
            workEmail: { type: "string", format: "email", example: "john.doe@company.com" },
            personalPhoneNumber: { type: "string", example: "+1234567890" },
            whatsappPhoneNumber: { type: "string", example: "+1234567890" },
            dateOfBirth: { type: "string", format: "date", example: "1990-01-01" },
            gender: { type: "string", enum: ["male", "female", "other"], example: "male" },
            maritalStatus: { type: "string", enum: ["single", "married", "divorced", "widowed"], example: "single" },
            nationality: { type: "string", example: "American" },
            passportNumber: { type: "string", example: "A12345678" },
            bloodGroup: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], example: "O+" },
            religion: { type: "string", example: "Christianity" },
            currentAddress: {
              type: "object",
              properties: {
                addressLine: { type: "string", example: "123 Main St" },
                city: { type: "string", example: "New York" },
                province: { type: "string", example: "NY" },
                postalCode: { type: "string", example: "10001" }
              }
            },
            permanentAddress: {
              type: "object",
              properties: {
                addressLine: { type: "string", example: "456 Home St" },
                city: { type: "string", example: "Boston" },
                province: { type: "string", example: "MA" },
                postalCode: { type: "string", example: "02101" }
              }
            },
            socialMediaLinks: {
              type: "object",
              properties: {
                linkedinProfile: { type: "string", example: "https://linkedin.com/in/johndoe" },
                facebookProfile: { type: "string", example: "https://facebook.com/johndoe" }
              }
            },
            hireDate: { type: "string", format: "date", example: "2024-01-01" },
            department: { type: "string", example: "Software Development" },
            position: { type: "string", example: "Senior Developer" },
            managerId: { type: "string", example: "EM21456" },
            workLocation: { type: "string", example: "Office Building A" },
            employmentType: { type: "string", enum: ["full-time", "part-time", "intern", "contract"], example: "full-time" },
            employmentStatus: { type: "string", enum: ["active", "inactive", "terminated"], example: "active" },
            terminationDate: { type: "string", format: "date", example: "2024-12-31" },
            workingHours: { type: "string", example: "9:00 AM - 5:00 PM" },
            basicSalary: { type: "number", example: 50000 },
            biometrics: {
              type: "object",
              properties: {
                fingerprint: { type: "string", example: "fingerprint_data" },
                faceId: { type: "string", example: "face_data" }
              }
            },
            emergencyContact: {
              type: "object",
              properties: {
                name: { type: "string", example: "Jane Doe" },
                phoneNumber: { type: "string", example: "+1234567891" },
                relationship: { type: "string", example: "Spouse" }
              }
            }
          }
        }
      }
    }
  } */
  try {
    const {
      firstName,
      lastName,
      fullName,
      userId,
      username,
      NIC,
      password,
      workEmail,
      personalPhoneNumber,
      whatsappPhoneNumber,
      dateOfBirth,
      gender,
      maritalStatus,
      nationality,
      passportNumber,
      bloodGroup,
      religion,
      currentAddress,
      permanentAddress,
      socialMediaLinks,
      hireDate,
      department,
      position,
      managerId,
      workLocation,
      employmentType,
      employmentStatus,
      terminationDate,
      workingHours,
      basicSalary,
      biometrics,
      emergencyContact,
    } = req.body;

    // Validate required fields
    if (!workEmail?.trim()) {
      return res.status(400).json({ 
        success: false,
        error: "Work email is required and cannot be empty" 
      });
    }

    // Convert managerId from string to ObjectId if needed
    let processedManagerId = managerId;
    if (managerId && !mongoose.Types.ObjectId.isValid(managerId)) {
      const manager = await User.findOne({ userId: managerId });
      
      if (manager) {
        processedManagerId = manager._id;
        console.log(`✅ Converted managerId: ${managerId} -> ${processedManagerId}`);
      } else {
        console.warn(`⚠️ Manager not found with userId: ${managerId}`);
        processedManagerId = null;
      }
    }
    
    // Check for duplicate users
    const existingUser = await User.findOne({
      $or: [
        { userId },
        { NIC },
        { workEmail },
        { username }
      ]
    });

    if (existingUser) {
      let duplicateField = "";
      if (existingUser.userId === userId) duplicateField = "userId";
      else if (existingUser.NIC === NIC) duplicateField = "NIC";
      else if (existingUser.workEmail === workEmail) duplicateField = "workEmail";
      else if (existingUser.username === username) duplicateField = "username";
      
      return res.status(400).json({ 
        success: false,
        error: `User with this ${duplicateField} already exists` 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({
      firstName,
      lastName,
      fullName,
      userId,
      username,
      NIC,
      password: hashedPassword,
      workEmail,
      personalPhoneNumber,
      whatsappPhoneNumber,
      dateOfBirth,
      gender,
      maritalStatus,
      nationality,
      passportNumber,
      bloodGroup,
      religion,
      currentAddress,
      permanentAddress,
      socialMediaLinks,
      hireDate,
      department,
      position,
      managerId: processedManagerId,
      workLocation,
      employmentType,
      employmentStatus: employmentStatus || "inactive",
      terminationDate,
      workingHours,
      basicSalary,
      biometrics,
      emergencyContact,
      forcePasswordChange: true,
      lastPasswordChange: new Date()
    });

    const savedUser = await user.save();
    console.log("✅ User created successfully with ID:", savedUser._id);
    
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: savedUser
    });
    
  } catch (error) {
    console.error("❌ User creation error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: "Validation failed", 
        details: errors 
      });
    }
    
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        error: "Duplicate field value entered" 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
};

/**
 * Update an existing user (accepts MongoDB _id OR userId)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const updateUser = async (req, res) => {
  /* #swagger.requestBody = {
    required: true,
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            firstName: { type: "string", example: "John" },
            lastName: { type: "string", example: "Doe" },
            fullName: { type: "string", example: "John Doe" },
            userId: { type: "string", example: "EMP001" },
            username: { type: "string", example: "johndoe123" },
            workEmail: { type: "string", format: "email", example: "john.doe@company.com" },
            personalPhoneNumber: { type: "string", example: "+1234567890" },
            whatsappPhoneNumber: { type: "string", example: "+1234567890" },
            dateOfBirth: { type: "string", format: "date", example: "1990-01-01" },
            gender: { type: "string", enum: ["male", "female", "other"], example: "male" },
            maritalStatus: { type: "string", enum: ["single", "married", "divorced", "widowed"], example: "single" },
            nationality: { type: "string", example: "American" },
            passportNumber: { type: "string", example: "A12345678" },
            bloodGroup: { type: "string", enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], example: "O+" },
            religion: { type: "string", example: "Christianity" },
            currentAddress: {
              type: "object",
              properties: {
                addressLine: { type: "string", example: "123 Main St" },
                city: { type: "string", example: "New York" },
                province: { type: "string", example: "NY" },
                postalCode: { type: "string", example: "10001" }
              }
            },
            permanentAddress: {
              type: "object",
              properties: {
                addressLine: { type: "string", example: "456 Home St" },
                city: { type: "string", example: "Boston" },
                province: { type: "string", example: "MA" },
                postalCode: { type: "string", example: "02101" }
              }
            },
            socialMediaLinks: {
              type: "object",
              properties: {
                linkedinProfile: { type: "string", example: "https://linkedin.com/in/johndoe" },
                facebookProfile: { type: "string", example: "https://facebook.com/johndoe" }
              }
            },
            password: { type: "string", example: "newPassword123" },
            hireDate: { type: "string", format: "date", example: "2024-01-01" },
            department: { type: "string", example: "Software Development" },
            position: { type: "string", example: "Senior Developer" },
            managerId: { type: "string", example: "EM21456" },
            workLocation: { type: "string", example: "Office Building A" },
            employmentType: { type: "string", enum: ["full-time", "part-time", "intern", "contract"], example: "full-time" },
            employmentStatus: { type: "string", enum: ["active", "inactive", "terminated"], example: "active" },
            terminationDate: { type: "string", format: "date", example: "2024-12-31" },
            workingHours: { type: "string", example: "9:00 AM - 5:00 PM" },
            basicSalary: { type: "number", example: 55000 },
            biometrics: {
              type: "object",
              properties: {
                fingerprint: { type: "string", example: "fingerprint_data" },
                faceId: { type: "string", example: "face_data" }
              }
            },
            emergencyContact: {
              type: "object",
              properties: {
                name: { type: "string", example: "Jane Doe" },
                phoneNumber: { type: "string", example: "+1234567891" },
                relationship: { type: "string", example: "Spouse" }
              }
            }
          }
        }
      }
    }
  } */
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Convert managerId from string to ObjectId if needed
    if (updateData.managerId && !mongoose.Types.ObjectId.isValid(updateData.managerId)) {
      const manager = await User.findOne({ userId: updateData.managerId });
      
      if (manager) {
        updateData.managerId = manager._id;
        console.log(`✅ Converted managerId: ${req.body.managerId} -> ${updateData.managerId}`);
      } else {
        console.warn(`⚠️ Manager not found with userId: ${updateData.managerId}`);
        updateData.managerId = null;
      }
    }

    // Hash password if provided
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
      updateData.lastPasswordChange = new Date();
    }

    let updatedUser;
    
    // Check if the id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        updateData,
        { 
          new: true,
          runValidators: true
        }
      ).select("-password");
    }
    
    // If not found or not a valid ObjectId, try to find and update by userId field
    if (!updatedUser) {
      updatedUser = await User.findOneAndUpdate(
        { userId: id },
        updateData,
        { 
          new: true,
          runValidators: true
        }
      ).select("-password");
    }

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    console.log(`✅ User updated successfully: ${updatedUser._id}`);

    return res.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser
    });

  } catch (error) {
    console.error("❌ User update error:", error);
    
    if (error.name === "ValidationError") {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        success: false,
        error: "Validation failed", 
        details: errors 
      });
    }
    
    return res.status(500).json({ 
      success: false,
      error: "Internal server error",
      details: error.message 
    });
  }
};

/**
 * Get all users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const listUsers = async (req, res) => {
  try {
    const users = await User.find()
      .populate("managerId", "userId fullName workEmail department position")
      .select("-password");

    return res.json({
      success: true,
      message: "Users retrieved successfully",
      data: users,
      count: users.length
    });

  } catch (error) {
    console.error("❌ List users error:", error);
    return res.status(500).json({ 
      success: false,
      error: "Failed to retrieve users",
      details: error.message 
    });
  }
};

/**
 * Get user by ID (accepts MongoDB _id OR userId like EMP001)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    let user;
    
    // Check if the id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id)
        .populate("managerId", "userId fullName workEmail department position")
        .select("-password");
    }
    
    // If not found or not a valid ObjectId, try to find by userId field
    if (!user) {
      user = await User.findOne({ userId: id })
        .populate("managerId", "userId fullName workEmail department position")
        .select("-password");
    }

    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    console.log(`✅ User retrieved successfully: ${user._id} (${user.userId})`);

    return res.json({
      success: true,
      message: "User retrieved successfully",
      data: user
    });

  } catch (error) {
    console.error("❌ Get user error:", error);
    
    return res.status(500).json({ 
      success: false,
      error: "Failed to retrieve user",
      details: error.message 
    });
  }
};

/**
 * Bulk Update Users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const bulkUpdateUsers = async (req, res) => {
  try {
    const { userIds, updates } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds array is required" });
    }

    if (!updates || typeof updates !== "object") {
      return res.status(400).json({ error: "updates object is required" });
    }

    // If password is being updated, hash it
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: updates }
    );

    const updatedUsers = await User.find({ _id: { $in: userIds } });

    res.json({
      message: `${result.modifiedCount} user(s) updated successfully`,
      modifiedCount: result.modifiedCount,
      users: updatedUsers,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Assign Role to Users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const assignRole = async (req, res) => {
  try {
    const { userIds, role } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds array is required" });
    }

    if (!role || typeof role !== "string") {
      return res.status(400).json({ error: "role is required" });
    }

    const validRoles = ["CEO", "COO", "Manager", "Employee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        error: "Invalid role. Must be one of: CEO, COO, Manager, Employee",
      });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { role } }
    );

    const updatedUsers = await User.find({ _id: { $in: userIds } });

    res.json({
      message: `Role "${role}" assigned to ${result.modifiedCount} user(s)`,
      modifiedCount: result.modifiedCount,
      users: updatedUsers,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Assign Permissions to Users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const assignPermissions = async (req, res) => {
  try {
    const { userIds, permissions } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds array is required" });
    }

    if (!permissions || typeof permissions !== "string") {
      return res.status(400).json({ error: "permissions is required" });
    }

    const validPermissions = [
      "CEO Permission",
      "COO Permission",
      "Manager Permission",
      "Employee Permission",
    ];
    if (!validPermissions.includes(permissions)) {
      return res.status(400).json({
        error:
          "Invalid permissions. Must be one of: CEO Permission, COO Permission, Manager Permission, Employee Permission",
      });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { permissions } }
    );

    const updatedUsers = await User.find({ _id: { $in: userIds } });

    res.json({
      message: `Permissions "${permissions}" assigned to ${result.modifiedCount} user(s)`,
      modifiedCount: result.modifiedCount,
      users: updatedUsers,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Assign Leave Policy to Users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const assignLeavePolicy = async (req, res) => {
  try {
    const { userIds, leavePolicy } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds array is required" });
    }

    if (!leavePolicy || typeof leavePolicy !== "string") {
      return res.status(400).json({ error: "leavePolicy is required" });
    }

    const validPolicies = [
      "CEO Leaves",
      "COO Leaves",
      "Manager Leaves",
      "Employee Leaves",
      "Sick Leaves",
    ];
    if (!validPolicies.includes(leavePolicy)) {
      return res.status(400).json({
        error:
          "Invalid leave policy. Must be one of: CEO Leaves, COO Leaves, Manager Leaves, Employee Leaves, Sick Leaves",
      });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { leavePolicy } }
    );

    const updatedUsers = await User.find({ _id: { $in: userIds } });

    res.json({
      message: `Leave policy "${leavePolicy}" assigned to ${result.modifiedCount} user(s)`,
      modifiedCount: result.modifiedCount,
      users: updatedUsers,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Assign System Role to Users
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const assignSystemRole = async (req, res) => {
  try {
    const { userIds, systemRole } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({ error: "userIds array is required" });
    }

    if (!systemRole || typeof systemRole !== "string") {
      return res.status(400).json({ error: "systemRole is required" });
    }

    const validSystemRoles = ["Manager", "Employee"];
    if (!validSystemRoles.includes(systemRole)) {
      return res.status(400).json({
        error: "Invalid system role. Must be one of: Manager, Employee",
      });
    }

    const result = await User.updateMany(
      { _id: { $in: userIds } },
      { $set: { systemRole } }
    );

    const updatedUsers = await User.find({ _id: { $in: userIds } });

    res.json({
      message: `System role "${systemRole}" assigned to ${result.modifiedCount} user(s)`,
      modifiedCount: result.modifiedCount,
      users: updatedUsers,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete user by ID (accepts MongoDB _id OR userId)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    let deletedUser;
    
    // Check if the id is a valid MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(id)) {
      deletedUser = await User.findByIdAndDelete(id);
    }
    
    // If not found or not a valid ObjectId, try to find and delete by userId field
    if (!deletedUser) {
      deletedUser = await User.findOneAndDelete({ userId: id });
    }

    if (!deletedUser) {
      return res.status(404).json({ 
        success: false,
        error: "User not found" 
      });
    }

    console.log(`✅ User deleted successfully: ${deletedUser._id} (${deletedUser.userId})`);

    return res.json({
      success: true,
      message: "User deleted successfully",
      data: { id: deletedUser._id, userId: deletedUser.userId }
    });

  } catch (error) {
    console.error("❌ Delete user error:", error);
    
    return res.status(400).json({ 
      success: false,
      error: "Failed to delete user",
      details: error.message 
    });
  }
};