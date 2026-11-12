
const { registerUser, loginUser, getProfile, logoutUser, changePassword, forgotPassword, resetPassword } = require("../controllers/authController");
const User = require("../models/User");

jest.mock("../models/User");

describe("Authentication Controller Tests", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = { body: {}, user: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();

    process.env.JWT_SECRET = "test-secret";
    process.env.NODE_ENV = "test";
  });

  test("should register a new user", async () => {
    req.body = {
      username: "TestUser",
      email: "TEST@example.com",
      password: "password123"
    };

    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue({
      _id: "123",
      username: "TestUser",
      email: "test@example.com",
      tokenVersion: 0
    });

    await registerUser(req, res, next);

    expect(User.create).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test("should reject registration with missing details", async () => {
    req.body = {};

    await registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });

  test("should reject an existing username or email", async () => {
    req.body = {
      username: "TestUser",
      email: "test@example.com",
      password: "password123"
    };

    User.findOne.mockResolvedValue({ _id: "123" });

    await registerUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
  });

  test("should login with correct password", async () => {
    req.body = {
      email: "test@example.com",
      password: "password123"
    };

    const user = {
      _id: "123",
      tokenVersion: 0,
      comparePassword: jest.fn().mockResolvedValue(true)
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user)
    });

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should reject incorrect login details", async () => {
    req.body = {
      email: "test@example.com",
      password: "wrongpassword"
    };

    const user = {
      comparePassword: jest.fn().mockResolvedValue(false)
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(user)
    });

    await loginUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("should return logged-in user profile", async () => {
    req.user = { username: "TestUser" };

    await getProfile(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  test("should logout and increase token version", async () => {
    req.user = {
      tokenVersion: 0,
      save: jest.fn().mockResolvedValue(true)
    };

    await logoutUser(req, res, next);

    expect(req.user.tokenVersion).toBe(1);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should reject password change with incorrect current password", async () => {
    req.user = { _id: "123" };
    req.body = {
      currentPassword: "wrongpassword",
      newPassword: "newpassword123"
    };

    const user = {
      comparePassword: jest.fn().mockResolvedValue(false)
    };

    User.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(user)
    });

    await changePassword(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  test("should return a safe response for an unknown forgot-password email", async () => {
    req.body = { email: "unknown@example.com" };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await forgotPassword(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
  });

  test("should reject an invalid reset token", async () => {
    req.body = {
      token: "invalid-token",
      newPassword: "newpassword123"
    };

    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null)
    });

    await resetPassword(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
