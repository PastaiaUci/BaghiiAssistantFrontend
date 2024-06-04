import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Signup.css";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/users", {
        username,
        password,
      });

      if (response.status === 201) {
        // Automatically log in the user after signup
        await axios.post(
          "http://localhost:5000/login",
          {
            username,
            password,
          },
          {
            withCredentials: true,
          }
        );

        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setError("Username already exists");
      } else {
        setError("Signup failed");
      }
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
