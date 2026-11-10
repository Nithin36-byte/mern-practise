import React, { useEffect, useState } from "react";

import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../services/courseService";

import { getInstructors } from "../services/instructorService";

function CourseManagement() {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    duration: "",
    fee: "",
    status: "Active",
    instructorId: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [courseData, instructorData] = await Promise.all([
        getCourses(),
        getInstructors(),
      ]);

      setCourses(courseData);
      setInstructors(instructorData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      code: "",
      description: "",
      duration: "",
      fee: "",
      status: "Active",
      instructorId: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      const courseData = {
        ...formData,
        fee: Number(formData.fee),
      };

      if (editingId) {
        await updateCourse(editingId, courseData);
        setMessage("Course updated successfully");
      } else {
        await createCourse(courseData);
        setMessage("Course created successfully");
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (course) => {
    setEditingId(course._id);

    setFormData({
      name: course.name,
      code: course.code,
      description: course.description || "",
      duration: course.duration,
      fee: String(course.fee),
      status: course.status,
      instructorId: course.instructor?._id || "",
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteCourse(id);

      setMessage("Course deleted successfully");
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Course Management</h1>
      <p>Create and manage available courses.</p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>{editingId ? "Update Course" : "Add New Course"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Course Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="code"
          placeholder="Course Code"
          value={formData.code}
          onChange={handleChange}
          required
        />

        <br /><br />

        <textarea
          name="description"
          placeholder="Course Description"
          value={formData.description}
          onChange={handleChange}
        />

        <br /><br />

        <input
          name="duration"
          placeholder="Duration (Example: 6 Months)"
          value={formData.duration}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="number"
          name="fee"
          placeholder="Course Fee"
          min="0"
          value={formData.fee}
          onChange={handleChange}
          required
        />

        <br /><br />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>

        <br /><br />

        <select
          name="instructorId"
          value={formData.instructorId}
          onChange={handleChange}
        >
          <option value="">Select Instructor</option>

          {instructors.map((instructor) => (
            <option key={instructor._id} value={instructor._id}>
              {instructor.fullName}
            </option>
          ))}
        </select>

        <br /><br />

        <button type="submit">
          {editingId ? "Update Course" : "Add Course"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Registered Courses</h2>

      {courses.length === 0 ? (
        <p>No courses found. Add your first course.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Code</th>
              <th>Duration</th>
              <th>Fee</th>
              <th>Instructor</th>
              <th>Students</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.name}</td>
                <td>{course.code}</td>
                <td>{course.duration}</td>
                <td>{course.fee}</td>
                <td>
                  {course.instructor?.fullName || "Not assigned"}
                </td>
                <td>{course.studentCount}</td>
                <td>{course.status}</td>
                <td>
                  <button onClick={() => handleEdit(course)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(course._id)}>
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

export default CourseManagement;