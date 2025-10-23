import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import adminRouters from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/TempPasswordRoutes.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };


dotenv.config();
const app = express();

// ✅ Enable CORS for frontend
app.use(
  cors({
    origin: true, // Allow all origins during development
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// ✅ Body parsing middleware MUST come first
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Add this for form data
app.use(cookieParser());

// ✅ Now add logging middleware AFTER body parser
app.use((req, res, next) => {
  // Check if body exists before destructuring
  if (!req.body) {
    console.log(`🚀 ${new Date().toISOString()} - ${req.method} ${req.path} - No body`);
    return next();
  }
  
  const { password, newPassword, currentPassword, ...safeBody } = req.body;
  const logBody = {
    ...safeBody,
    ...(password && { password: '[REDACTED]' }),
    ...(newPassword && { newPassword: '[REDACTED]' }),
    ...(currentPassword && { currentPassword: '[REDACTED]' })
  };
  console.log(`🚀 ${new Date().toISOString()} - ${req.method} ${req.path} from ${req.get('origin') || 'unknown'}`);
  console.log('📦 Body:', logBody);
  next();
});

// Environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL;

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Swagger API docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ✅ User CRUD routes
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRouters)
app.use("/api/auth", authRoutes);
app.use("/api/otp", otpRoutes);

// ✅ Test root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server is running on port ${PORT}`);
  console.log(`📊 Swagger Documentation: http://localhost:${PORT}/api-docs`);
});
