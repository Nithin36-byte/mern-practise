import { useState, useEffect } from "react";
import FormInput from "./FormInput";
import "./StudentForm.css";

function StudentForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    gender: "",
    course: "",
    address: ""
  });

  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  useEffect(() => {
    document.title = "Student Registration";
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value
    });

    setErrors({
      ...errors,
      [name]: ""
    });

    setSuccess("");
  }

  function validateForm() {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (!formData.gender) {
      newErrors.gender = "Please select gender";
    }

    if (!formData.course) {
      newErrors.course = "Please select a course";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSuccess("");
      return;
    }

    console.log("Student Details:", formData);

    setSuccess("Student registered successfully!");

    setFormData({
      fullName: "",
      email: "",
      mobile: "",
      gender: "",
      course: "",
      address: ""
    });

    setErrors({});
  }

  return (
    <div className="registration-container">
      <form className="student-form" onSubmit={handleSubmit}>
        <h2>Student Registration</h2>

        <FormInput
          label="Full Name"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          error={errors.fullName}
        />

        <FormInput
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          error={errors.email}
        />

        <FormInput
          label="Mobile Number"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter 10-digit mobile number"
          error={errors.mobile}
        />

        <div className="form-group">
          <label htmlFor="gender">Gender</label>

          <select
            id="gender"
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
            <small className="error-text">{errors.gender}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="course">Course</label>

          <select
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
          >
            <option value="">Select Course</option>
            <option value="MERN Stack">MERN Stack</option>
            <option value="Java">Java</option>
            <option value="Python">Python</option>
            <option value="Web Development">Web Development</option>
          </select>

          {errors.course && (
            <small className="error-text">{errors.course}</small>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>

          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows="3"
          />

          {errors.address && (
            <small className="error-text">{errors.address}</small>
          )}
        </div>

        <button type="submit" className="submit-button">
          Register Student
        </button>

        {success && (
          <p className="success-message">{success}</p>
        )}
      </form>
    </div>
  );
}

export default StudentForm;