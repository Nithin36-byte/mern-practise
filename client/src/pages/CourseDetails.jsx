import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import {
  getCourseById,
  getCourseStudents,
} from "../services/courseService";

function CourseDetails() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDetails = async () => {
      try {
        const [courseData, studentData] = await Promise.all([
          getCourseById(id),
          getCourseStudents(id),
        ]);

        setCourse(courseData);
        setStudents(studentData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [id]);

  if (loading) return <p>Loading course details...</p>;

  if (error) return <p>{error}</p>;

  if (!course) return <p>Course not found.</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Course Details</h1>

      <p><strong>Name:</strong> {course.name}</p>
      <p><strong>Code:</strong> {course.code}</p>
      <p><strong>Description:</strong> {course.description}</p>
      <p><strong>Duration:</strong> {course.duration}</p>
      <p><strong>Fee:</strong> {course.fee}</p>
      <p><strong>Status:</strong> {course.status}</p>

      <p>
        <strong>Instructor:</strong>{" "}
        {course.instructor?.fullName || "Not assigned"}
      </p>

      <h2>Enrolled Students ({students.length})</h2>

      {students.length === 0 ? (
        <p>No students enrolled in this course yet.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Email</th>
              <th>Mobile</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr key={student._id}>
                <td>{student.fullName}</td>
                <td>{student.email}</td>
                <td>{student.mobile}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <br />
      <Link to="/courses">Back to Courses</Link>
    </div>
  );
}

export default CourseDetails;