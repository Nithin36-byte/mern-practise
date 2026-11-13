
const express = require("express");
const router = express.Router();

const validateRequest = require("../middleware/validateRequest");

const {
    registerSchema,
    loginSchema
} = require("../validators/authValidation");

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
router.post(
    "/register",
    validateRequest(registerSchema),
    registerUser
);

router.post(
    "/login",
    validateRequest(loginSchema),
    loginUser
);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Protected routes
router.get("/me", protect, getProfile);
router.post("/logout", protect, logoutUser);
router.patch("/change-password", protect, changePassword);

module.exports = router;
