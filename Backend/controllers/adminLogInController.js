import bcrypt from "bcryptjs";
import admin from "../models/admin.js";
import jwt from "jsonwebtoken";

export const adminLogInController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw new Error("Please provide email");
    }
    if (!password) {
      throw new Error("Please provide password");
    }

    const user = await admin.findOne({ email });

    if (!user) {
      throw new Error("You are not allowed to access TalentNest");
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    console.log("checkPassoword", checkPassword);

    if (checkPassword) {
      const tokenData = {
        _id: user._id,
        email: user.email,
      };
      const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET_KEY, {
        expiresIn: 60 * 60 * 8,
      });

      const tokenOption = {
        httpOnly: true,
        secure: true,
      };

      res.cookie("token", token, tokenOption).status(200).json({
        message: "Login successfully",
        data: token,
        success: true,
        error: false,
      });
    } else {
      throw new Error("Please check Password");
    }
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

export const createAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new admin({
      email,
      password: hashedPassword,
    });

    const savedAdmin = await newAdmin.save();
    return res.status(201).json(savedAdmin);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};
