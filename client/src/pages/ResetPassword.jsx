
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { resetPassword } from "../services/authService";

function ResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    token: "",
    newPassword: ""
  });

  const [message, setMessage] = useState("");
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

    setMessage("");
    setError("");
    setLoading(true);

    try {
      const result = await resetPassword(form);

      setMessage(result.message);

      setForm({
        token: "",
        newPassword: ""
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-container">
      <div className="student-card">
        <h1>Reset Password</h1>

        <p>Enter your reset token and new password.</p>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {message && (
          <p className="success-message">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">

            <textarea
              name="token"
              placeholder="Paste your reset token"
              value={form.token}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={form.newPassword}
              onChange={handleChange}
              minLength="8"
              required
            />

          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <button
            type="button"
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        )}

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
