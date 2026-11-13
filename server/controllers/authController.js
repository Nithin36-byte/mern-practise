
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const createToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is missing from .env");
  }

  return jwt.sign(
    {
      id: user._id,
      tokenVersion: user.tokenVersion
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    }
  );
};

// Register a new user
const registerUser = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide username, email and password"
      });
    }

    if (username.trim().length < 3) {
      return res.status(400).json({
        success: false,
        message: "Username must contain at least 3 characters"
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      $or: [
        { username: cleanUsername },
        { email: cleanEmail }
      ]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists"
      });
    }

    const user = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      password
    });

    const token = createToken(user);

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      data: user
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists"
      });
    }

    next(error);
  }
};

// Login an existing user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: user
    });

  } catch (error) {
    next(error);
  }
};

// Get logged-in user's profile
const getProfile = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: req.user
  });
};

// Logout and invalidate existing tokens
const logoutUser = async (req, res, next) => {
  try {
    req.user.tokenVersion += 1;

    await req.user.save();

    return res.status(200).json({
      success: true,
      message: "Logout successful"
    });

  } catch (error) {
    next(error);
  }
};

// Change current password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide current and new passwords"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "New password must contain at least 8 characters"
      });
    }

    const user = await User.findById(req.user._id)
      .select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect"
      });
    }

    user.password = newPassword;
    user.tokenVersion += 1;

    await user.save();

    const token = createToken(user);

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
      token
    });

  } catch (error) {
    next(error);
  }
};

// Forgot password - generate reset token
const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (typeof email !== "string" || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please provide your email address"
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase()
    }).select("+resetPasswordToken +resetPasswordExpires");

    // Do not reveal whether an account exists
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the account exists, reset instructions will be sent."
      });
    }

    // Generate a secure random reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store only the hashed token
    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Set token expiry to 15 minutes
    user.resetPasswordExpires = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save({ validateBeforeSave: false });

    const response = {
      success: true,
      message: "Password reset token generated"
    };

    // Show reset token only during local development
    if (process.env.NODE_ENV === "development") {
      response.resetToken = resetToken;
    }

    return res.status(200).json(response);

  } catch (error) {
    next(error);
  }
};

// Reset password using reset token
const resetPassword = async (req, res, next) => {
  try {
    const { token, newPassword } = req.body;

    if (
      typeof token !== "string" ||
      typeof newPassword !== "string" ||
      !token ||
      !newPassword
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide reset token and new password"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least 8 characters"
      });
    }

    // Hash the received reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with a valid and unexpired token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() }
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset token is invalid or expired"
      });
    }

    // Update password and invalidate previous sessions
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.tokenVersion += 1;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    next(error);
  }
};

// Export all controller functions
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  changePassword,
  forgotPassword,
  resetPassword
};
