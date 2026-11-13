
const mongoose = require("mongoose");

const fileAssetSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
      index: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    originalName: {
      type: String,
      required: true,
    },

    storageName: {
      type: String,
      required: true,
    },

    storagePath: {
      type: String,
      required: true,
      select: false,
    },

    mimeType: {
      type: String,
      required: true,
    },

    fileSize: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      enum: ["profilePhoto", "supportingDocument"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

fileAssetSchema.index({ student: 1, category: 1 });

const FileAsset = mongoose.model("FileAsset", fileAssetSchema);

module.exports = FileAsset;
