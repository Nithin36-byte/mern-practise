
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPassword } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage("");
    setError("");
    setResetToken("");
    setLoading(true);

    try {
      const result = await forgotPassword(email);

      setMessage(result.message);
      setResetToken(result.resetToken || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="student-container">
      <div className="student-card">
        <h1>Forgot Password</h1>

        <p>Enter your registered email address.</p>

        {error && (
          <p className="error-message">{error}</p>
        )}

        {message && (
          <p className="success-message">{message}</p>
        )}

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter registered email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Request Reset Token"}
          </button>
        </form>

        {resetToken && (
          <div>
            <p>Development Reset Token:</p>
            <textarea
              value={resetToken}
              readOnly
              rows="4"
            />

            <p>
              Copy this token and use it on the Reset Password page.
            </p>
          </div>
        )}

        <p>
          <Link to="/reset-password">Go to Reset Password</Link>
        </p>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;
