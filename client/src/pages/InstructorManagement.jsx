import React, { useEffect, useState } from "react";

import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
} from "../services/instructorService";

function InstructorManagement() {
  const [instructors, setInstructors] = useState([]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    specialization: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadInstructors = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getInstructors();
      setInstructors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInstructors();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      specialization: "",
    });

    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setMessage("");

      if (editingId) {
        await updateInstructor(editingId, formData);
        setMessage("Instructor updated successfully");
      } else {
        await createInstructor(formData);
        setMessage("Instructor added successfully");
      }

      resetForm();
      await loadInstructors();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (instructor) => {
    setEditingId(instructor._id);

    setFormData({
      fullName: instructor.fullName,
      email: instructor.email,
      specialization: instructor.specialization,
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this instructor?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      await deleteInstructor(id);

      setMessage("Instructor deleted successfully");
      await loadInstructors();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading instructors...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Instructor Management</h1>
      <p>Add and manage instructors.</p>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>{editingId ? "Update Instructor" : "Add Instructor"}</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="fullName"
          placeholder="Instructor Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <br /><br />

        <input
          name="specialization"
          placeholder="Specialization"
          value={formData.specialization}
          onChange={handleChange}
          required
        />

        <br /><br />

        <button type="submit">
          {editingId ? "Update Instructor" : "Add Instructor"}
        </button>

        {editingId && (
          <button type="button" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <hr />

      <h2>Registered Instructors</h2>

      {instructors.length === 0 ? (
        <p>No instructors found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Specialization</th>
              <th>Assigned Courses</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {instructors.map((instructor) => (
              <tr key={instructor._id}>
                <td>{instructor.fullName}</td>
                <td>{instructor.email}</td>
                <td>{instructor.specialization}</td>
                <td>{instructor.courseCount}</td>
                <td>
                  <button onClick={() => handleEdit(instructor)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(instructor._id)}>
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

export default InstructorManagement;