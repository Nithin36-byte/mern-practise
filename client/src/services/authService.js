
import apiRequest from "./api";

// Register a new user
export const registerUser = async (userData) => {
  const result = await apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify(userData)
  });

  sessionStorage.setItem("token", result.token);

  return result;
};

// Login user
export const loginUser = async (userData) => {
  const result = await apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(userData)
  });

  sessionStorage.setItem("token", result.token);

  return result;
};

// Get logged-in user's profile
export const getProfile = () => {
  return apiRequest("/auth/me");
};

// Logout user
export const logoutUser = async () => {
  try {
    return await apiRequest("/auth/logout", {
      method: "POST"
    });
  } finally {
    sessionStorage.removeItem("token");
  }
};

// Change password
export const changePassword = async (passwordData) => {
  const result = await apiRequest("/auth/change-password", {
    method: "PATCH",
    body: JSON.stringify(passwordData)
  });

  // Save the new token returned by the backend
  sessionStorage.setItem("token", result.token);

  return result;
};

// Request password reset
export const forgotPassword = (email) => {
  return apiRequest("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ email })
  });
};

// Reset password
export const resetPassword = (passwordData) => {
  return apiRequest("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(passwordData)
  });
};
