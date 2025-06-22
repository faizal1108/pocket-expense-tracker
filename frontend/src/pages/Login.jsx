import React, { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import "../pages/css/Register.css"; // you can rename this later or make separate Login.css

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const userCred = await login(email, password);
      const userEmail = userCred.user.email;
      sessionStorage.setItem("userEmail", userEmail);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-page">
      <div className="auth-page-container">
        <div className="auth-card">
          <h1 className="app-title">
            <a href="/">💰 Pocket Tracker</a>
          </h1>
          <h2 className="auth-heading">Login to Your Account</h2>

          {error && <p className="auth-error">{error}</p>}

          <input
            type="email"
            placeholder="Enter your email"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="off"
          />

          <input
            type="password"
            placeholder="Enter your password"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="off"
          />

          <button className="auth-button" onClick={handleLogin}>
            Login
          </button>

          <p className="auth-footer">
            Don&apos;t have an account? <a href="/register">Register</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
