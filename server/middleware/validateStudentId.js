const mongoose = require("mongoose");

const validateStudentId = (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID"
    });
  }

  next();
};

module.exports = validateStudentId;