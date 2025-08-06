const User = require("../models/user");
const bcrypt = require("bcryptjs");
const sendMail = require("../utils/mailer");
const generatePassword = require("../utils/generatePassword");
const { createToken } = require("../utils/jwt");

// 🔐 Register New User
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    // 📧 Send confirmation email
    try {
      await sendMail(
        user.email,
        "Registration Successful",
        `Hello ${username},\n\nYou have successfully registered to our authentication system.\n\nThanks!`
      );

      return res.status(201).json({ message: "User registered and confirmation email sent." });

    } catch (emailErr) {
      console.warn("⚠️ Registered, but email failed:", emailErr.message);
      return res.status(201).json({
        message: "User registered, but confirmation email failed to send.",
      });
    }

  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// 🔐 Login User
exports.login = async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) return res.status(401).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    const token = createToken({ id: user._id });

    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: "Strict",
    //   maxAge: 24 * 60 * 60 * 1000 // 1 day
    // });
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,         // ✅ Required for HTTPS (Render is HTTPS)
      sameSite: "None",     // ✅ Required for cross-origin
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // 📧 Send login email
    try {
      await sendMail(
        user.email,
        "Login Notification",
        `Hi ${user.username},\n\nYou have just logged in to your account. If this wasn't you, please reset your password immediately.`
      );
    } catch (err) {
      console.warn("⚠️ Login email failed:", err.message);
      // Don't block login if email fails
    }

    res.json({ message: "Login successful" });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login" });
  }
};

// 🔐 Logout User
exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  });
  res.json({ message: "Logged out successfully" });
};

// 🔐 Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email not registered" });

    const newPassword = generatePassword();
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await sendMail(
      email,
      "Password Reset",
      `Hi ${user.username},\n\nYour new temporary password is:\n\n${newPassword}\n\nPlease log in and change it immediately.`
    );

    res.json({ message: "New password sent to your email" });

  } catch (err) {
    console.error("❌ Forgot Password Error:", err);
    res.status(500).json({ message: "Server error during password reset" });
  }
};

// 🔐 Update Password (Protected Route)
exports.updatePassword = async (req, res) => {
  const { usernameOrEmail, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
    });

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Old password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("❌ Update Password Error:", err);
    res.status(500).json({ message: "Server error during password update" });
  }
};
