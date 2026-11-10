
import React, { useEffect, useState } from "react";

import {
  uploadPhoto,
  uploadDocument,
  getStudentFiles,
  getFileBlob,
  deleteUploadedFile,
} from "../services/fileService";

function StudentUploads() {
  const [studentId, setStudentId] = useState("");
  const [photo, setPhoto] = useState(null);
  const [document, setDocument] = useState(null);

  const [files, setFiles] = useState([]);
  const [photoUrl, setPhotoUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Load files belonging to the selected student
  const loadFiles = async () => {
    if (!studentId.trim()) {
      setError("Please enter the Student ID");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      const result = await getStudentFiles(studentId.trim());
      setFiles(result.data || []);
    } catch (err) {
      setError(err.message);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  // Load protected profile photo for preview
  useEffect(() => {
    let objectUrl;

    const loadPhoto = async () => {
      const photoFile = files.find(
        (file) => file.category === "profilePhoto"
      );

      if (!photoFile) {
        setPhotoUrl("");
        return;
      }

      try {
        const blob = await getFileBlob(photoFile._id);
        objectUrl = URL.createObjectURL(blob);
        setPhotoUrl(objectUrl);
      } catch (err) {
        setPhotoUrl("");
        console.error("Unable to display photo:", err.message);
      }
    };

    loadPhoto();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [files]);

  // Upload profile photo
  const handlePhotoUpload = async (e) => {
    e.preventDefault();

    if (!photo) {
      setError("Please select a profile photo");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await uploadPhoto(studentId.trim(), photo);

      setPhoto(null);
      e.target.reset();

      setMessage("Profile photo uploaded successfully");
      await loadFiles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload supporting document
  const handleDocumentUpload = async (e) => {
    e.preventDefault();

    if (!document) {
      setError("Please select a PDF document");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setMessage("");

      await uploadDocument(studentId.trim(), document);

      setDocument(null);
      e.target.reset();

      setMessage("Supporting document uploaded successfully");
      await loadFiles();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Download a supporting document
  const handleDownload = async (file) => {
    try {
      const blob = await getFileBlob(file._id);
      const url = URL.createObjectURL(blob);

      const link = window.document.createElement("a");
      link.href = url;
      link.download = file.originalName;

      window.document.body.appendChild(link);
      link.click();
      link.remove();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete uploaded file
  const handleDelete = async (fileId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteUploadedFile(fileId);

      setMessage("File deleted successfully");
      await loadFiles();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "700px" }}>
      <h1>Student File Management</h1>

      <p>Upload student profile photos and supporting documents.</p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <label>Student MongoDB ID</label>

      <input
        type="text"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        placeholder="Enter Student ID"
      />

      <br /><br />

      <button type="button" onClick={loadFiles} disabled={loading}>
        Load Student Files
      </button>

      <hr />

      <h2>Upload Profile Photo</h2>

      <form onSubmit={handlePhotoUpload}>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={(e) => setPhoto(e.target.files[0] || null)}
        />

        <p>Allowed: JPG, PNG, WebP. Maximum size: 5 MB.</p>

        <button type="submit" disabled={loading}>
          Upload Photo
        </button>
      </form>

      {photoUrl && (
        <div>
          <h3>Current Profile Photo</h3>

          <img
            src={photoUrl}
            alt="Student Profile"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "10px",
            }}
          />
        </div>
      )}

      <hr />

      <h2>Upload Supporting Document</h2>

      <form onSubmit={handleDocumentUpload}>
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={(e) => setDocument(e.target.files[0] || null)}
        />

        <p>Allowed: PDF only. Maximum size: 10 MB.</p>

        <button type="submit" disabled={loading}>
          Upload Document
        </button>
      </form>

      <hr />

      <h2>Uploaded Files</h2>

      {loading && <p>Processing...</p>}

      {files.length === 0 ? (
        <p>No uploaded files found.</p>
      ) : (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>File Name</th>
              <th>Category</th>
              <th>Size (KB)</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {files.map((file) => (
              <tr key={file._id}>
                <td>{file.originalName}</td>
                <td>{file.category}</td>
                <td>{(file.fileSize / 1024).toFixed(2)}</td>

                <td>
                  <button
                    type="button"
                    onClick={() => handleDownload(file)}
                  >
                    Open / Download
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(file._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default StudentUploads;
