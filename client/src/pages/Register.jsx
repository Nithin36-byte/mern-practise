
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await registerUser(form);
      navigate("/students");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-container">
      <div className="student-card">

        <h1>Create Account</h1>

        {error && (
          <p className="error-message">{error}</p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="form-grid">

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              minLength="3"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={form.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password (minimum 8 characters)"
              value={form.password}
              onChange={handleChange}
              minLength="8"
              required
            />

          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Registering..." : "Create Account"}
          </button>

        </form>

        <p>
          Already registered? <Link to="/login">Login</Link>
        </p>

      </div>
    </div>
  );
}

export default Register;
