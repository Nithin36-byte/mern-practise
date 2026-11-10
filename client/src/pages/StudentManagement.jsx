
import { useEffect, useState } from "react";

import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent
} from "../services/studentService";

import "./StudentManagement.css";

const emptyForm = {
  fullName: "",
  email: "",
  mobile: "",
  gender: "",
  course: "",
  address: ""
};

function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  // Search, filters, sorting and pagination
  const [filters, setFilters] = useState({
    search: "",
    course: "",
    gender: "",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10
  });

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Load students whenever filters change
  useEffect(() => {
    loadStudents(filters);
  }, [
    filters.search,
    filters.course,
    filters.gender,
    filters.sortBy,
    filters.sortOrder,
    filters.page,
    filters.limit
  ]);

  // Get students from backend
  const loadStudents = async (currentFilters) => {
    setLoading(true);
    setError("");

    try {
      const result = await getStudents(currentFilters);

      // Correct the page if the last record was deleted
      if (
        result.totalPages > 0 &&
        currentFilters.page > result.totalPages
      ) {
        setFilters((previous) => ({
          ...previous,
          page: result.totalPages
        }));
        return;
      }

      setStudents(result.data || []);
      setTotal(result.total || 0);
      setTotalPages(result.totalPages || 0);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Update a filter and return to the first page
  const updateFilter = (name, value) => {
    setFilters((previous) => ({
      ...previous,
      [name]: value,
      page: 1
    }));
  };

  // Handle form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  // Create or update student
  const handleSubmit = async (event) => {
    event.preventDefault();

    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await updateStudent(editingId, formData);
        setMessage("Student updated successfully.");
      } else {
        await createStudent(formData);
        setMessage("Student registered successfully.");
      }

      setFormData(emptyForm);
      setEditingId(null);

      const firstPage = {
        ...filters,
        page: 1
      };

      setFilters(firstPage);
      await loadStudents(firstPage);

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // View individual student
  const handleView = async (id) => {
    setError("");
    setSelectedStudent(null);

    try {
      const result = await getStudentById(id);
      setSelectedStudent(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Edit student
  const handleEdit = (student) => {
    setFormData({
      fullName: student.fullName || "",
      email: student.email || "",
      mobile: student.mobile || "",
      gender: student.gender || "",
      course: student.course || "",
      address: student.address || ""
    });

    setEditingId(student._id);
    setError("");
    setMessage("");
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    setError("");
    setMessage("");

    try {
      await deleteStudent(id);

      setMessage("Student deleted successfully.");
      setSelectedStudent(null);

      await loadStudents(filters);

    } catch (err) {
      setError(err.message);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setError("");
    setMessage("");
  };

  return (
    <div className="student-container">

      <h1>Student Management System</h1>

      <p className="subtitle">
        Register and manage student information
      </p>

      {error && (
        <p className="error-message">{error}</p>
      )}

      {message && (
        <p className="success-message">{message}</p>
      )}

      {/* Student registration form */}
      <div className="student-card">

        <h2>
          {editingId ? "Edit Student" : "Student Registration"}
        </h2>

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="mobile"
              placeholder="10 digit Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              name="course"
              placeholder="Course"
              value={formData.course}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              value={formData.address}
              onChange={handleChange}
              required
            />

          </div>

          <button type="submit" disabled={saving}>
            {saving
              ? "Saving..."
              : editingId
              ? "Update Student"
              : "Register Student"}
          </button>

          {editingId && (
            <button
              type="button"
              className="cancel-button"
              onClick={handleCancel}
            >
              Cancel
            </button>
          )}

        </form>
      </div>

      {/* Search and filter section */}
      <div className="student-card">

        <h2>Search and Filter Students</h2>

        <div className="filter-grid">

          <input
            type="text"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={(event) =>
              updateFilter("search", event.target.value)
            }
          />

          <input
            type="text"
            placeholder="Enter exact course name"
            value={filters.course}
            onChange={(event) =>
              updateFilter("course", event.target.value)
            }
          />

          <select
            value={filters.gender}
            onChange={(event) =>
              updateFilter("gender", event.target.value)
            }
          >
            <option value="">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <select
            value={filters.sortBy}
            onChange={(event) =>
              updateFilter("sortBy", event.target.value)
            }
          >
            <option value="createdAt">Registration Date</option>
            <option value="fullName">Student Name</option>
          </select>

          <select
            value={filters.sortOrder}
            onChange={(event) =>
              updateFilter("sortOrder", event.target.value)
            }
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>

          <select
            value={filters.limit}
            onChange={(event) =>
              updateFilter("limit", Number(event.target.value))
            }
          >
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>

        </div>

        <button
          type="button"
          className="clear-button"
          onClick={() => {
            setFilters({
              search: "",
              course: "",
              gender: "",
              sortBy: "createdAt",
              sortOrder: "desc",
              page: 1,
              limit: 10
            });
          }}
        >
          Clear Filters
        </button>

      </div>

      {/* Student table */}
      <div className="student-card">

        <h2>Registered Students</h2>

        <p>
          Total matching students: <strong>{total}</strong>
        </p>

        {loading ? (
          <p>Loading students...</p>
        ) : students.length === 0 ? (
          <p>No matching students found.</p>
        ) : (

          <div className="table-wrapper">

            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Gender</th>
                  <th>Course</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {students.map((student) => (

                  <tr key={student._id}>

                    <td>{student.fullName}</td>
                    <td>{student.email}</td>
                    <td>{student.mobile}</td>
                    <td>{student.gender}</td>
                    <td>{student.course}</td>

                    <td className="action-buttons">

                      <button
                        type="button"
                        onClick={() => handleView(student._id)}
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() => handleEdit(student)}
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() => handleDelete(student._id)}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}
              </tbody>

            </table>

          </div>

        )}

        {/* Pagination controls */}
        {total > 0 && (
          <div className="pagination">

            <button
              type="button"
              disabled={filters.page <= 1 || loading}
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  page: previous.page - 1
                }))
              }
            >
              Previous
            </button>

            <span>
              Page {filters.page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={
                filters.page >= totalPages || loading
              }
              onClick={() =>
                setFilters((previous) => ({
                  ...previous,
                  page: previous.page + 1
                }))
              }
            >
              Next
            </button>

          </div>
        )}

      </div>

      {/* Individual student details */}
      {selectedStudent && (
        <div className="student-card">

          <h2>Student Details</h2>

          <p>Name: {selectedStudent.fullName}</p>
          <p>Email: {selectedStudent.email}</p>
          <p>Mobile: {selectedStudent.mobile}</p>
          <p>Gender: {selectedStudent.gender}</p>
          <p>Course: {selectedStudent.course}</p>
          <p>Address: {selectedStudent.address}</p>

          <button
            type="button"
            onClick={() => setSelectedStudent(null)}
          >
            Close
          </button>

        </div>
      )}

    </div>
  );
}

export default StudentManagement;
