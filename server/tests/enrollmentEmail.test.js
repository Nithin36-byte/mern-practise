
const createEnrollmentEmail = require("../templates/enrollmentEmail");

describe("Enrollment Email Tests", () => {
  test("should contain student and course details", () => {
    const email = createEnrollmentEmail({
      fullName: "Nithin Test",
      email: "test@example.com",
      course: {
        name: "MERN Stack Development",
        code: "MERN101",
      },
    });

    expect(email.subject).toBe("Student Enrollment Confirmation");
    expect(email.text).toContain("Nithin Test");
    expect(email.html).toContain("MERN Stack Development");
  });

  test("should escape HTML tags", () => {
    const email = createEnrollmentEmail({
      fullName: "<script>alert('test')</script>",
      email: "test@example.com",
      course: {
        name: "MERN Stack Development",
        code: "MERN101",
      },
    });

    expect(email.html).not.toMatch(/<script>/i);
  });
});
