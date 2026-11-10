
const nodemailer = require("nodemailer");
const createEnrollmentEmail = require("../templates/enrollmentEmail");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  connectionTimeout: 15000,
  greetingTimeout: 15000,
  socketTimeout: 20000,
});

// Check email connection
const verifyEmailConnection = async () => {
  await transporter.verify();
  return true;
};

// Send enrollment confirmation
const sendEnrollmentConfirmation = async (student) => {
  if (!student || !student.email || !student.fullName) {
    throw new Error("Student name and email are required");
  }

  const emailContent = createEnrollmentEmail(student);

  const result = await transporter.sendMail({
    from: process.env.EMAIL_FROM || process.env.SMTP_USER,
    to: student.email,
    subject: emailContent.subject,
    text: emailContent.text,
    html: emailContent.html,
  });

  return {
    messageId: result.messageId,
    accepted: result.accepted,
  };
};

module.exports = {
  verifyEmailConnection,
  sendEnrollmentConfirmation,
};
