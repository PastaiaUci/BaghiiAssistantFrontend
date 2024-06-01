import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../SideBarPage/SideBar';
import VoiceAnimation from '../VoiceAnimation';
import './Home.css';

const Home = () => {
  const [isVoiceAssistantActive, setIsVoiceAssistantActive] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const startVoiceAssistant = async () => {
    try {
      await axios.post('http://localhost:5000/start_voice_assistant');
      console.log('Voice assistant started');
      setIsVoiceAssistantActive(true);
    } catch (error) {
      console.error('Error starting voice assistant:', error);
    }
  };

  const startHandGesture = async () => {
    try {
      await axios.post('http://localhost:5000/start_hand_gesture');
      console.log('Hand gesture recognition started');
    } catch (error) {
      console.error('Error starting hand gesture recognition:', error);
    }
  };

  return (
    <div className="home-wrapper">
      <Sidebar />
      <div className="home-container">
        <div className="header">
          <button onClick={handleLogout} className="logout-button">Logout</button>
        </div>
        <h1 className="title">Welcome to your own personal online assistant!</h1>
        <div className="intro">
          <p>
            Our online assistant helps you manage your daily tasks effortlessly.
            Whether you need a quick joke to lighten up your day, a song to lift
            your spirits, or a query answered from Wikipedia, we have you covered.
          </p>
        </div>
        <div className="content">
          <div className="box voice-assistant" onClick={startVoiceAssistant}>
            <h3>Voice Assistant</h3>
            <p>Click to start the voice assistant</p>
          </div>
          <div className="box hand-gesture" onClick={startHandGesture}>
            <h3>Hand Gesture</h3>
            <p>Click to start hand gesture recognition</p>
          </div>
        </div>
        {isVoiceAssistantActive && <VoiceAnimation />}
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
    </div>
  );
};

export default Home;