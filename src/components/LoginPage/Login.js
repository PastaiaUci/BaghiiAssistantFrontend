import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [socket, setSocket] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const response = await axios.post(
        "http://localhost:5000/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        navigate("/home");
      }
    } catch (error) {
      setError("Invalid username or password");
    }
  };

  const handleFaceLogin = () => {
    setShowWebcam(true);
    const newSocket = io("http://localhost:5000", { withCredentials: true });
    setSocket(newSocket);

    newSocket.on("face_login_success", (data) => {
      setUsername(data.username);
      setPassword(data.password);
      handleLogin();
    });

    newSocket.on("face_login_failure", () => {
      setError("Face recognition failed. Please try again.");
    });

    newSocket.on("response_frame", (data) => {
      const img = new Image();
      img.src = `data:image/jpeg;base64,${data.image}`;
      img.onload = () => {
        const canvas = canvasRef.current;
        if (canvas) {
          const ctx = canvas.getContext("2d");
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        }
      };
    });
  };

  const captureFrame = useCallback(() => {
    if (webcamRef.current && socket) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socket.emit("frame", {
          image: imageSrc.split(",")[1],
          mode: "faceLogin",
        });
      }
    }
  }, [webcamRef, socket]);

  useEffect(() => {
    if (socket) {
      const interval = setInterval(captureFrame, 1000);
      return () => clearInterval(interval);
    }
  }, [captureFrame, socket]);

  const closeWebcam = () => {
    setShowWebcam(false);
    if (socket) {
      socket.disconnect();
    }
    setSocket(null);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
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
        <button type="submit" className="login-button">
          Login
        </button>
        <button
          type="button"
          className="login-button"
          onClick={handleFaceLogin}
        >
          Face Login
        </button>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </form>

      {showWebcam && (
        <div className="webcam-modal">
          <div className="webcam-container">
            <button className="close-button" onClick={closeWebcam}>
              X
            </button>
            <div className="webcam-frame">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width={640}
                height={480}
                style={{ position: "absolute", zIndex: 9, opacity: 0 }}
              />
              <canvas
                ref={canvasRef}
                width={640}
                height={480}
                style={{ position: "absolute", top: 0, left: 0, zIndex: 10 }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
