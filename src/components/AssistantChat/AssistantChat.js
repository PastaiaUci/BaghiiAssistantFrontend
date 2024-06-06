import React from "react";
import "./AssistantChat.css";

const AssistantChat = ({ messages }) => {
  return (
    <div className="assistant-chat">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.type}`}>
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssistantChat;
