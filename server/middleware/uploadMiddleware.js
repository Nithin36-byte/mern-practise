
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

const photoFolder = path.join(__dirname, "..", "uploads", "photos");
const documentFolder = path.join(
  __dirname,
  "..",
  "uploads",
  "documents"
);

// Create upload folders when necessary
fs.mkdirSync(photoFolder, { recursive: true });
fs.mkdirSync(documentFolder, { recursive: true });

// Allowed photo formats
const photoTypes = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

// Allowed document format
const documentTypes = {
  ".pdf": "application/pdf",
};

// Create upload middleware
const createUploader = (folder, allowedTypes, maxSize, fieldName) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, folder);
    },

    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();
      const safeName = crypto.randomBytes(16).toString("hex");

      cb(null, `${safeName}${extension}`);
    },
  });

  const upload = multer({
    storage,

    limits: {
      fileSize: maxSize,
    },

    fileFilter: (req, file, cb) => {
      const extension = path.extname(file.originalname).toLowerCase();

      if (
        !allowedTypes[extension] ||
        allowedTypes[extension] !== file.mimetype
      ) {
        return cb(
          new Error("Invalid file type. Please select an allowed file.")
        );
      }

      cb(null, true);
    },
  });

  // Handle upload errors with clear responses
  return (req, res, next) => {
    upload.single(fieldName)(req, res, (error) => {
      if (error instanceof multer.MulterError) {
        const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;

        return res.status(status).json({
          success: false,
          message:
            error.code === "LIMIT_FILE_SIZE"
              ? "File size is too large."
              : error.message,
        });
      }

      if (error) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      next();
    });
  };
};

const uploadPhoto = createUploader(
  photoFolder,
  photoTypes,
  5 * 1024 * 1024,
  "photo"
);

const uploadDocument = createUploader(
  documentFolder,
  documentTypes,
  10 * 1024 * 1024,
  "document"
);

module.exports = {
  uploadPhoto,
  uploadDocument,
};
