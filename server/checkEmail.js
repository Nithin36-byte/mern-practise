
const dotenv = require("dotenv");

dotenv.config({ path: __dirname + "/.env" });

const {
  verifyEmailConnection,
} = require("./services/emailService");

const checkEmail = async () => {
  try {
    await verifyEmailConnection();

    console.log("Email server connected successfully");
  } catch (error) {
    console.error(
      "Email connection failed:",
      error.code || error.message
    );

    process.exitCode = 1;
  }
};

checkEmail();
