const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const uri = process.env.MONGO_URI;

    console.log("MongoDB URI loaded:", Boolean(uri));
    console.log(
      "Cluster address:",
      uri ? uri.split("@")[1]?.split("/")[0] : "Missing"
    );

    await mongoose.connect(uri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;