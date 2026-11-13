
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProfile,
  changePassword,
  logoutUser
} from "../services/authService";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const result = await getProfile();
      setUser(result.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value
    });
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      const result = await changePassword(form);

      setMessage(result.message);

      setForm({
        currentPassword: "",
        newPassword: ""
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      setError(err.message);
    } finally {
      sessionStorage.removeItem("token");
      navigate("/login");
    }
  };

  return (
    <div className="student-container">
      <div className="student-card">
        <h1>My Profile</h1>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        {user ? (
          <>
            <p><strong>Username:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
          </>
        ) : (
          <p>Loading profile...</p>
        )}

        <h2>Change Password</h2>

        <form onSubmit={handlePasswordSubmit}>
          <div className="form-grid">
            <input
              type="password"
              name="currentPassword"
              placeholder="Current Password"
              value={form.currentPassword}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={form.newPassword}
              onChange={handleChange}
              minLength="8"
              required
            />
          </div>

          <button type="submit">
            Change Password
          </button>
        </form>

        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
