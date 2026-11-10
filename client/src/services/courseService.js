import apiRequest from "./api";

export const getCourses = async () => {
  const result = await apiRequest("/courses");
  return result.data;
};

export const getCourseById = async (id) => {
  const result = await apiRequest(`/courses/${id}`);
  return result.data;
};

export const getCourseStudents = async (id) => {
  const result = await apiRequest(`/courses/${id}/students`);
  return result.data;
};

export const createCourse = async (courseData) => {
  return await apiRequest("/courses", {
    method: "POST",
    body: JSON.stringify(courseData),
  });
};

export const updateCourse = async (id, courseData) => {
  return await apiRequest(`/courses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(courseData),
  });
};

export const deleteCourse = async (id) => {
  return await apiRequest(`/courses/${id}`, {
    method: "DELETE",
  });
};