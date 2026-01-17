import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Otp from "../models/otp.model.js";
import googleClient from "../config/google.js";
import { GOOGLE_CLIENT_ID, JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js";
import { compareValue } from "../utils/bcrypt.util.js";
import { sendOtpEmail } from "../utils/mailer.util.js";

export const requestOtp = async (req, res, next) => {
  try {
    console.log("[OTP] Request received");
    const { email } = req.body;
    console.log("[OTP] Email:", email);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("[OTP] Email already in use:", email);
      return res.status(409).json({ message: "Email already in use" });
    }
    console.log("[OTP] Email available");
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("[OTP] Generated OTP");
    await Otp.findOneAndUpdate(
      { email },
      { otp, expiresAt: new Date(Date.now() + 10 * 60000) },
      { upsert: true },
    );

    console.log("[OTP] Saved to database");
    console.log("[OTP] Attempting to send email...");
    await sendOtpEmail(email, otp);
    console.log("[OTP] Email sent successfully");
    res.status(200).json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("[OTP] Error occurred:", error.message);
    console.error("[OTP] Error stack:", error.stack);
    next(error);
  }
};

export const checkAuth = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { firstName, lastName, email, password, otp } = req.body;

    const otpRecord = await Otp.findOne({ email });

    if (!otpRecord || otpRecord.otp !== otp) {
      const error = new Error("Invalid or expired verification code");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      const error = new Error("Email already in use");
      error.statusCode = 409;
      throw error;
    }

    const newUsers = await User.create(
      [{ firstName, lastName, email, password }],
      {
        session,
      },
    );

    await Otp.deleteOne({ email }).session(session);

    const token = jwt.sign({ userId: newUsers[0]._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        token,
        user: newUsers[0],
      },
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const isPasswordValid = await compareValue(password, user.password);
    if (!isPasswordValid) {
      const error = new Error("Invalid password");
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      message: "User signed in successfully",
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleSignIn = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: GOOGLE_CLIENT_ID,
    });

    const {
      given_name: firstName,
      family_name: lastName,
      email,
      picture,
      sub: googleId,
      picture: avatar,
    } = ticket.getPayload();

    let user = await User.findOne({ email });
    if (user) {
      if (!user.googleId) {
        user.googleId = googleId;
        if (!user.firstName) user.firstName = firstName;
        if (!user.lastName) user.lastName = lastName;
        if (!user.avatar) user.avatar = avatar;
        await user.save();
      }
    } else {
      user = await User.create({
        firstName,
        lastName,
        email,
        avatar: picture,
        googleId,
      });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(200).json({
      success: true,
      data: { token, user },
    });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      success: true,
      message: "User signed out successfully",
    });
  } catch (error) {
    next(error);
  }
};
