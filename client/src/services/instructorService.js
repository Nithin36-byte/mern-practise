
import apiRequest from "./api";

// Get all instructors
export const getInstructors = async () => {
  const result = await apiRequest("/instructors");
  return result.data;
};

// Get instructor by ID
export const getInstructorById = async (id) => {
  const result = await apiRequest(`/instructors/${id}`);
  return result.data;
};

// Create a new instructor
export const createInstructor = async (instructorData) => {
  return await apiRequest("/instructors", {
    method: "POST",
    body: JSON.stringify(instructorData),
  });
};

// Update instructor details
export const updateInstructor = async (id, instructorData) => {
  return await apiRequest(`/instructors/${id}`, {
    method: "PATCH",
    body: JSON.stringify(instructorData),
  });
};

// Delete instructor
export const deleteInstructor = async (id) => {
  return await apiRequest(`/instructors/${id}`, {
    method: "DELETE",
  });
};
