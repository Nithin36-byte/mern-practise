
const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  changePassword,
  forgotPassword,
  resetPassword
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", protect, getProfile);
router.post("/logout", protect, logoutUser);
router.patch("/change-password", protect, changePassword);

module.exports = router;
