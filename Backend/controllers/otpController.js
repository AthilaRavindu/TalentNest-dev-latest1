// controllers/otpController.js - IMPROVED VERSION WITH ENV VARIABLES
import nodemailer from "nodemailer";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// Check if environment variables are loaded
console.log("Environment check:");
console.log("SMTP_USER:", process.env.SMTP_USER ? "✅ Loaded" : "❌ Missing");
console.log("SMTP_PASS:", process.env.SMTP_PASS ? "✅ Loaded" : "❌ Missing");

// Email configuration with environment variables and fallback
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "omanthibandara326@gmail.com",
    pass: process.env.SMTP_PASS || "qjekrmqoounsdcys",
  },
});

// Test email configuration on startup
transporter.verify((error, success) => {
  if (error) {
    console.log("❌ Email configuration error:", error.message);
    console.log("💡 Make sure your .env file is properly loaded");
  } else {
    console.log("✅ Email server is ready to send messages");
    console.log("📧 Using email:", process.env.SMTP_USER || "fallback email");
  }
});

// Helper function to safely log request data without passwords
const logSafeRequestData = (requestBody) => {
  const { password, newPassword, currentPassword, ...safeData } = requestBody;
  return {
    ...safeData,
    password: password ? "[REDACTED]" : undefined,
    newPassword: newPassword ? "[REDACTED]" : undefined,
    currentPassword: currentPassword ? "[REDACTED]" : undefined,
  };
};

export const sendCredentials = async (req, res) => {
  try {
    console.log(
      "📧 Received send credentials request:",
      logSafeRequestData(req.body)
    );

    const { username, password, employeeName, NIC, userId } = req.body;

    // Validate request data
    if (!username || !password || !employeeName) {
      console.log("❌ Missing required fields");
      return res.status(400).json({
        success: false,
        message: "Username, password, and employee name are required",
      });
    }

    // Use the actual userId from work details, fallback to generated ID if not provided
    const employeeId = userId || `EMP-${Date.now().toString().slice(-6)}-TEMP`;

    console.log("📧 Preparing to send credentials email");
    console.log("📧 Employee ID:", employeeId);
    console.log("📧 Sending to:", username);

    // Get email sender info from environment or fallback
    const fromEmail =
      process.env.SMTP_FROM || '"TalentNest HR" <omanthibandara326@gmail.com>';

    // Email content
    const mailOptions = {
      from: fromEmail,
      to: username,
      subject: "Your TalentNest Login Credentials - One-Time Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #0d9488; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
                .credentials { 
                  background: white; 
                  padding: 20px; 
                  border-left: 4px solid #0d9488; 
                  margin: 20px 0; 
                  border-radius: 4px;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .password-box {
                  background: #f0f0f0; 
                  padding: 8px 12px; 
                  border-radius: 4px;
                  font-family: 'Courier New', monospace;
                  font-weight: bold;
                  font-size: 16px;
                  color: #0d9488;
                  display: inline-block;
                }
                .warning {
                  background: #fef3c7;
                  border: 1px solid #f59e0b;
                  padding: 15px;
                  border-radius: 4px;
                  margin: 15px 0;
                }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
                ul { padding-left: 20px; }
                li { margin: 8px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Welcome to TalentNest!</h1>
                </div>
                <div class="content">
                    <p>Dear <strong>${employeeName}</strong>,</p>
                    <p>Your login credentials have been created. Please use the information below to access your account.</p>
                    
                    <div class="credentials">
                        <p><strong>👤 Employee ID:</strong><br>${employeeId}</p>
                        <p><strong>📧 Work Email/Username:</strong><br>${username}</p>
                        <p><strong>🔐 One-Time Password:</strong><br>
                        <span class="password-box">${password}</span></p>
                    </div>

                    <div class="warning">
                        <p><strong>🚨 Important Security Notes:</strong></p>
                        <ul>
                            <li><strong>You must change this password</strong> after your first login</li>
                            <li>Keep these credentials safe and do not share them</li>
                            <li>Contact HR if you have any issues logging in</li>
                            <li>This password expires after first use</li>
                        </ul>
                    </div>

                    <p><strong>Next Steps:</strong></p>
                    <ol>
                        <li>Visit the TalentNest login page</li>
                        <li>Enter your work email and the one-time password above</li>
                        <li>You'll be prompted to create a new secure password</li>
                        <li>Complete your profile setup</li>
                        <li>Start using the TalentNest platform!</li>
                    </ol>

                    <p>If you have any questions or need assistance, please contact our HR team.</p>

                    <p>Best regards,<br>
                    <strong>TalentNest HR Team</strong></p>
                </div>
                <div class="footer">
                    <p>This email contains sensitive information. Please keep it secure.</p>
                    <p>© ${new Date().getFullYear()} TalentNest. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
      `,
    };

    console.log("📧 Attempting to send email...");

    try {
      // Send email
      const emailResult = await transporter.sendMail(mailOptions);
      console.log(
        "✅ Credentials email sent successfully! Message ID:",
        emailResult.messageId
      );

      res.status(200).json({
        success: true,
        message: "Credentials email sent successfully",
        emailSent: true,
        messageId: emailResult.messageId,
        employeeId: employeeId,
        note: "Employee can now login with the provided credentials.",
      });
    } catch (emailError) {
      console.error("❌ Email sending failed:", emailError.message);
      console.error("❌ Full email error:", emailError);

      // Provide more specific error information
      let errorMessage = "Failed to send credentials email";
      if (emailError.message.includes("authentication")) {
        errorMessage = "Email authentication failed. Check email credentials.";
      } else if (emailError.message.includes("network")) {
        errorMessage = "Network error. Check internet connection.";
      }

      res.status(500).json({
        success: false,
        message: errorMessage,
        emailSent: false,
        emailError: emailError.message,
        employeeId: employeeId,
        debug: {
          smtpUser: process.env.SMTP_USER ? "Set" : "Missing",
          smtpPass: process.env.SMTP_PASS ? "Set" : "Missing",
        },
      });
    }
  } catch (error) {
    console.error("❌ Error processing credentials:", error);

    res.status(500).json({
      success: false,
      message: "Failed to process credentials",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    console.log("🔐 Verifying login for user:", req.body.username);

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const user = await User.findOne({
      $or: [{ username }, { workEmail: username }],
    });

    if (!user) {
      console.log("❌ User not found:", username);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log("❌ Invalid password for user:", username);
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    console.log("✅ Password verified for user:", username);

    if (user.forcePasswordChange) {
      console.log("🔄 Password change required for user:", username);
      return res.status(200).json({
        success: true,
        message: "Login successful - password change required",
        forcePasswordChange: true,
        userId: user._id,
        employeeId: user.userId,
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        userId: user.userId,
        username: user.username,
        fullName: user.fullName,
        workEmail: user.workEmail,
        position: user.position,
        department: user.department,
        workLocation: user.workLocation,
        employmentType: user.employmentType,
        employmentStatus: user.employmentStatus,
        hireDate: user.hireDate,
      },
    });
  } catch (error) {
    console.error("❌ Error verifying login:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    console.log("🔄 Password change request for user:", req.body.userId);

    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "User ID, current password, and new password are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log("❌ User not found for password change:", userId);
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      console.log("❌ Current password incorrect for user:", userId);
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters long",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        success: false,
        message: "New password must be different from current password",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    user.password = hashedNewPassword;
    user.forcePasswordChange = false;
    user.lastPasswordChange = new Date();

    await user.save();

    console.log("✅ Password changed successfully for user:", userId);

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("❌ Error changing password:", error);
    res.status(500).json({
      success: false,
      message: "Password change failed",
      error:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Internal server error",
    });
  }
};
