
import React, { useState } from "react";
import { validateStudentForm } from "../utils/studentValidation";
import { createStudent } from "../services/studentService";

const StudentForm = ({ onStudentAdded }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    course: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));

    // Clear the error for the edited field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ""
    }));

    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    // Validate form data
    const validationErrors = validateStudentForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const studentData = {
        ...formData,
        email: formData.email.trim().toLowerCase(),
        fullName: formData.fullName.trim(),
        mobile: formData.mobile.trim(),
        address: formData.address.trim()
      };

      const response = await createStudent(studentData);

      setMessage(
        response?.message || "Student registered successfully!"
      );
      setMessageType("success");

      setFormData({
        fullName: "",
        email: "",
        mobile: "",
        gender: "",
        course: "",
        address: ""
      });

      if (onStudentAdded) {
        onStudentAdded(response);
      }

    } catch (error) {
      const responseData = error.response?.data;

      if (responseData?.errors) {
        const serverErrors = {};

        if (Array.isArray(responseData.errors)) {
          responseData.errors.forEach((item) => {
            if (item.field) {
              serverErrors[item.field] = item.message;
            }
          });
        }

        if (Object.keys(serverErrors).length > 0) {
          setErrors(serverErrors);
        }
      }

      setMessage(
        responseData?.message ||
        error.message ||
        "Unable to register student. Please try again."
      );

      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-form-container">
      <h2>Student Registration</h2>

      {message && (
        <p
          className={
            messageType === "success"
              ? "success-message"
              : "error-message"
          }
        >
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit} noValidate>

        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <p className="field-error">{errors.fullName}</p>
          )}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="field-error">{errors.email}</p>
          )}
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="tel"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter mobile number"
          />
          {errors.mobile && (
            <p className="field-error">{errors.mobile}</p>
          )}
        </div>

        <div className="form-group">
          <label>Gender</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="field-error">{errors.gender}</p>
          )}
        </div>

        <div className="form-group">
          <label>Course ID</label>
          <input
            type="text"
            name="course"
            value={formData.course}
            onChange={handleChange}
            placeholder="Enter MongoDB course ID"
          />
          {errors.course && (
            <p className="field-error">{errors.course}</p>
          )}
        </div>

        <div className="form-group">
          <label>Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter address"
            rows="3"
          />
          {errors.address && (
            <p className="field-error">{errors.address}</p>
          )}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Register Student"}
        </button>

      </form>
    </div>
  );
};

export default StudentForm;
