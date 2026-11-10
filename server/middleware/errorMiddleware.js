const errorHandler = (error, req, res, next) => {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "A student with this email already exists"
    });
  }

  if (error.name === "ValidationError") {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: Object.values(error.errors).map(item => item.message)
    });
  }

  if (error.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid data format"
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error"
  });
};

module.exports = errorHandler;