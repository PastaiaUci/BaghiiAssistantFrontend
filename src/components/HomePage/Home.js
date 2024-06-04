import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../SideBarPage/SideBar";
import Webcam from "react-webcam";
import { io } from "socket.io-client";
import "./Home.css";

const Home = () => {
  const [username, setUsername] = useState("");
  const [showWebcam, setShowWebcam] = useState(false);
  const [mode, setMode] = useState(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [socket, setSocket] = useState(null);
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/session", {
          withCredentials: true,
        });
        if (response.data.username) {
          setUsername(response.data.username);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user session:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const checkVoiceAssistantStatus = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/voice_assistant_status"
        );
        setIsSpeaking(response.data.status === "active");
      } catch (error) {
        console.error("Error checking voice assistant status:", error);
      }
    };

    const interval = setInterval(checkVoiceAssistantStatus, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (showWebcam && mode) {
      const newSocket = io("http://localhost:5000");
      setSocket(newSocket);

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

      return () => newSocket.close();
    }
  }, [showWebcam, mode]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const startVoiceAssistant = async () => {
    try {
      await axios.post(
        "http://localhost:5000/start_voice_assistant",
        {},
        { withCredentials: true }
      );
      console.log("Voice assistant started");
      setIsSpeaking(true);
    } catch (error) {
      console.error("Error starting voice assistant:", error);
    }
  };

  const startHandGesture = async () => {
    setMode("handGesture");
    setShowWebcam(true);
  };

  const startFaceRecognition = async () => {
    setMode("faceRecognition");
    setShowWebcam(true);
  };

  const closeWebcam = () => {
    setShowWebcam(false);
    setMode(null);
  };

  const captureFrame = useCallback(() => {
    if (webcamRef.current && socket) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        socket.emit("frame", {
          image: imageSrc.split(",")[1],
          mode,
          name: username,
        });
      } else {
        console.error("Webcam capture failed.");
      }
    }
  }, [webcamRef, socket, mode, username]);

  useEffect(() => {
    const interval = setInterval(captureFrame, 200);
    return () => clearInterval(interval);
  }, [captureFrame]);

  return (
    <div className="home-wrapper">
      <Sidebar />
      <div className="home-container">
        <div className="header">
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
        <h1 className="title">
          Welcome to your own personal online assistant, {username}!
        </h1>
        <div className="intro">
          <p>
            Our online assistant helps you manage your daily tasks effortlessly.
            Whether you need a quick joke to lighten up your day, a song to lift
            your spirits, or a query answered from Wikipedia, we have you
            covered.
          </p>
        </div>
        <div className="content">
          <div
            className={`box voice-assistant ${isSpeaking ? "speaking" : ""}`}
            onClick={startVoiceAssistant}
          >
            <h3>Voice Assistant</h3>
            <p>
              {isSpeaking
                ? "Assistant Active"
                : "Click to start the voice assistant"}
            </p>
          </div>
          <div className="box hand-gesture" onClick={startHandGesture}>
            <h3>Hand Gesture</h3>
            <p>Click to start hand gesture recognition</p>
          </div>
          <div className="box face-recognition" onClick={startFaceRecognition}>
            <h3>Face Recognition</h3>
            <p>Click to start face recognition</p>
          </div>
        </div>
        <div className="features">
          <h2>Features</h2>
          <ul>
            <li>Search Wikipedia for quick information.</li>
            <li>Play your favorite songs on YouTube.</li>
            <li>Get the latest jokes to brighten your day.</li>
            <li>Use hand gestures to control the assistant seamlessly.</li>
          </ul>
        </div>
        <div className="credits">
          <p>Credits: Baghii Org</p>
        </div>
      </div>

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

export default Home;
