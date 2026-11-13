
const authorize = require("../middleware/authorizeMiddleware");

describe("Role Authorization Tests", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { user: null };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  test("should allow an Admin", () => {
    req.user = { role: "Admin" };

    authorize("Admin", "Staff")(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("should allow Staff when Staff role is permitted", () => {
    req.user = { role: "Staff" };

    authorize("Admin", "Staff")(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  test("should reject Viewer from an Admin-only route", () => {
    req.user = { role: "Viewer" };

    authorize("Admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test("should reject a request without a logged-in user", () => {
    authorize("Admin")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});
