
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getToken = () => sessionStorage.getItem("token");

// Send a file request with the logged-in user's token
const fileRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();

  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: "Unexpected server response" };
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed: ${response.status}`);
  }

  return data;
};

// Upload a student profile photo
export const uploadPhoto = async (studentId, file) => {
  const formData = new FormData();
  formData.append("photo", file);

  return fileRequest(`/uploads/${studentId}/photo`, {
    method: "POST",
    body: formData,
  });
};

// Upload a supporting PDF document
export const uploadDocument = async (studentId, file) => {
  const formData = new FormData();
  formData.append("document", file);

  return fileRequest(`/uploads/${studentId}/document`, {
    method: "POST",
    body: formData,
  });
};

// Get files belonging to a student
export const getStudentFiles = async (studentId) => {
  return fileRequest(`/uploads/student/${studentId}`);
};

// Get a file as a Blob for displaying or downloading
export const getFileBlob = async (fileId) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/uploads/${fileId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Unable to open the uploaded file");
  }

  return response.blob();
};

// Delete an uploaded file
export const deleteUploadedFile = async (fileId) => {
  return fileRequest(`/uploads/${fileId}`, {
    method: "DELETE",
  });
};
