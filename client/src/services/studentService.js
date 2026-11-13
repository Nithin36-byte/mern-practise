import apiRequest from "./api";

// Get students with search, filters, sorting and pagination
export const getStudents = (filters = {}) => {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== "" && value !== null && value !== undefined) {
      params.set(key, String(value));
    }
  });

  return apiRequest(`/students?${params.toString()}`);
};

// Get one student
export const getStudentById = (id) => {
  return apiRequest(`/students/${id}`);
};

// Create a student
export const createStudent = (studentData) => {
  return apiRequest("/students", {
    method: "POST",
    body: JSON.stringify(studentData)
  });
};

// Update a student
export const updateStudent = (id, studentData) => {
  return apiRequest(`/students/${id}`, {
    method: "PATCH",
    body: JSON.stringify(studentData)
  });
};

// Delete a student
export const deleteStudent = (id) => {
  return apiRequest(`/students/${id}`, {
    method: "DELETE"
  });
};