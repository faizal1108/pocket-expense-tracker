import React, { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../pages/css/Register.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed.");
    }
  };

  return (
    <div className="register-page">
      <div className="auth-page-container">
        <div className="auth-card">
          <h1 className="app-title">
            <a href="/">💰 Pocket Tracker</a>
          </h1>
          <h2 className="auth-heading">Create an Account</h2>

          {error && <p className="auth-error">{error}</p>}

          <input
            type="email"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            className="auth-input"
            required
            autoComplete="off"
          />

          <input
            type="password"
            placeholder="Create a password (min 6 chars)"
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            required
            autoComplete="off"
          />

          <input
            type="password"
            placeholder="Confirm password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-input"
            required
            autoComplete="off"
          />

          <button className="auth-button" onClick={handleRegister}>
            Register
          </button>

          <p className="auth-footer">
            Already have an account? <a href="/login">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
