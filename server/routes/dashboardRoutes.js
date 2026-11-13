
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const dashboardController = require("../controllers/dashboardController");

// Support both common export styles for authentication
const protect =
    typeof authMiddleware === "function"
        ? authMiddleware
        : authMiddleware.protect;

const getDashboardStats = dashboardController.getDashboardStats;

// Check that the required functions exist
if (typeof protect !== "function") {
    throw new Error("protect middleware is not exported correctly from authMiddleware.js");
}

if (typeof getDashboardStats !== "function") {
    throw new Error("getDashboardStats is not exported correctly from dashboardController.js");
}

// Allow only Admin and Staff
const allowDashboardRoles = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Please login first"
        });
    }

    if (!["Admin", "Staff"].includes(req.user.role)) {
        return res.status(403).json({
            success: false,
            message: "You do not have permission to view dashboard reports"
        });
    }

    next();
};

// Dashboard statistics route
router.get(
    "/stats",
    protect,
    allowDashboardRoles,
    getDashboardStats
);

module.exports = router;
