const dotenv = require("dotenv");
dotenv.config({ path: __dirname + "/.env" });

const mongoose = require("mongoose");

const updateAdminRole = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MongoDB connection string is missing");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const result = await mongoose.connection
      .collection("users")
      .updateOne(
        {
          email: "nithinnelakurthi@gmail.com",
        },
        {
          $set: {
            role: "Admin",
          },
          $unset: {
            "Data type": "",
            field: "",
            "field value": "",
          },
        }
      );

    if (result.matchedCount === 0) {
      console.log("User account not found");
    } else {
      console.log("Admin role updated successfully");
      console.log("Modified documents:", result.modifiedCount);
    }

  } catch (error) {
    console.log("Error:", error.message);
  } finally {
    await mongoose.disconnect();
  }
};

updateAdminRole();