
const escapeHtml = (value = "") => {
  return String(value).replace(/[&<>"']/g, (char) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[char];
  });
};

const createEnrollmentEmail = (student) => {
  const name = escapeHtml(student.fullName);
  const email = escapeHtml(student.email);
  const course = escapeHtml(
    student.course?.name || "Course not specified"
  );

  const courseCode = escapeHtml(
    student.course?.code || "Not available"
  );

  return {
    subject: "Student Enrollment Confirmation",

    text: `
Dear ${student.fullName},

Your student registration was successful.

Student Name: ${student.fullName}
Email: ${student.email}
Course: ${student.course?.name || "Course not specified"}
Course Code: ${student.course?.code || "Not available"}

Regards,
Student Portal Team
    `,

    html: `
      <div style="font-family: Arial; padding: 20px;">
        <h1 style="color: #2563eb;">Welcome to Student Portal!</h1>

        <h2>Enrollment Successful</h2>

        <p>Dear ${name},</p>

        <p>Your student registration has been completed successfully.</p>

        <p><strong>Student Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Course:</strong> ${course}</p>
        <p><strong>Course Code:</strong> ${courseCode}</p>

        <p>Thank you for registering with Student Portal.</p>

        <p>Regards,<br>Student Portal Team</p>
      </div>
    `,
  };
};

module.exports = createEnrollmentEmail;
