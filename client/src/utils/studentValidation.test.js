import { describe, it, expect } from "vitest";
import { validateStudentForm } from "./studentValidation";

describe("Student Form Validation", () => {
  it("should show errors when fields are empty", () => {
    const errors = validateStudentForm({
      fullName: "",
      email: "",
      mobile: "",
      gender: "",
      course: "",
      address: "",
    });

    expect(Object.keys(errors).length).toBeGreaterThan(0);
  });

  it("should show an error for invalid email", () => {
    const errors = validateStudentForm({
      fullName: "Test Student",
      email: "wrongemail",
      mobile: "9876543210",
      gender: "Male",
      course: "123456789012345678901234",
      address: "Hyderabad",
    });

    expect(errors.email).toBeDefined();
  });
});