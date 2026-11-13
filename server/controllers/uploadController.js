
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const FileType = require("file-type");

const Student = require("../models/Student");
const FileAsset = require("../models/FileAsset");

// Safely remove a file from local storage
const removeLocalFile = async (filePath) => {
  if (!filePath) return;

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("File cleanup failed:", error.message);
    }
  }
};

// Check the real file content, not only its extension
const validateFileContent = async (file, category) => {
  const detected = await FileType.fromFile(file.path);

  if (!detected) return false;

  if (category === "profilePhoto") {
    return ["image/jpeg", "image/png", "image/webp"].includes(
      detected.mime
    );
  }

  if (category === "supportingDocument") {
    return detected.mime === "application/pdf";
  }

  return false;
};

// Upload a profile photo or supporting document
const saveUploadedFile = async (req, res, next, category) => {
  let newFilePath;

  try {
    if (!mongoose.isValidObjectId(req.params.studentId)) {
      if (req.file) await removeLocalFile(req.file.path);

      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select a file to upload",
      });
    }

    newFilePath = req.file.path;

    const student = await Student.findById(req.params.studentId);

    if (!student) {
      await removeLocalFile(newFilePath);

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const isValid = await validateFileContent(req.file, category);

    if (!isValid) {
      await removeLocalFile(newFilePath);

      return res.status(400).json({
        success: false,
        message: "The actual file content does not match an allowed file type",
      });
    }

    const fileData = {
      student: student._id,
      uploadedBy: req.user._id,
      originalName: path.basename(req.file.originalname),
      storageName: req.file.filename,
      storagePath: newFilePath,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      category,
    };

    // A student can have only one current profile photo
    if (category === "profilePhoto") {
      const existingPhoto = await FileAsset.findOne({
        student: student._id,
        category: "profilePhoto",
      }).select("+storagePath");

      if (existingPhoto) {
        const oldPath = existingPhoto.storagePath;

        Object.assign(existingPhoto, fileData);
        await existingPhoto.save();

        await removeLocalFile(oldPath);

        return res.status(200).json({
          success: true,
          message: "Profile photo replaced successfully",
          data: {
            id: existingPhoto._id,
            originalName: existingPhoto.originalName,
            category: existingPhoto.category,
            fileSize: existingPhoto.fileSize,
          },
        });
      }
    }

    const savedFile = await FileAsset.create(fileData);

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        id: savedFile._id,
        originalName: savedFile.originalName,
        category: savedFile.category,
        mimeType: savedFile.mimeType,
        fileSize: savedFile.fileSize,
      },
    });
  } catch (error) {
    if (newFilePath) {
      await removeLocalFile(newFilePath);
    }

    next(error);
  }
};

// Upload profile photo
const uploadProfilePhoto = (req, res, next) => {
  saveUploadedFile(req, res, next, "profilePhoto");
};

// Upload supporting document
const uploadSupportingDocument = (req, res, next) => {
  saveUploadedFile(req, res, next, "supportingDocument");
};

// Get all files belonging to a student
const getStudentFiles = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.studentId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student = await Student.findById(req.params.studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const files = await FileAsset.find({
      student: student._id,
    })
      .select("-storagePath -storageName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: files.length,
      data: files,
    });
  } catch (error) {
    next(error);
  }
};

// Display or download a protected file
const getFile = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.fileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const file = await FileAsset.findById(req.params.fileId)
      .select("+storagePath");

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    if (!fs.existsSync(file.storagePath)) {
      return res.status(404).json({
        success: false,
        message: "Stored file is missing",
      });
    }

    res.setHeader("Content-Type", file.mimeType);
    res.setHeader("Cache-Control", "private, no-store");

    if (file.category === "supportingDocument") {
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${encodeURIComponent(file.originalName)}"`
      );
    } else {
      res.setHeader("Content-Disposition", "inline");
    }

    res.sendFile(file.storagePath);
  } catch (error) {
    next(error);
  }
};

// Delete a stored file
const deleteFile = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.fileId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid file ID",
      });
    }

    const file = await FileAsset.findById(req.params.fileId)
      .select("+storagePath");

    if (!file) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const filePath = file.storagePath;

    await file.deleteOne();
    await removeLocalFile(filePath);

    res.status(200).json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  uploadProfilePhoto,
  uploadSupportingDocument,
  getStudentFiles,
  getFile,
  deleteFile,
};
