// // // routes/authRoutes.js
const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authenticate = require("../middlewares/authMiddleware");

// Public Routes
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout); // clears JWT cookie
router.post("/forgot-password", authController.forgotPassword);

// Protected Routes
router.post("/update-password", authenticate, authController.updatePassword);
router.get("/dashboard", authenticate, (req, res) => {
  res.json({ message: `Welcome user ${req.user.id}` });
});

module.exports = router;
