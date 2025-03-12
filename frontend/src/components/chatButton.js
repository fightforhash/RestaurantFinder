import React from 'react';
import { useNavigate } from 'react-router-dom';

function ChatButton() {
  const navigate = useNavigate();

  const handleChatClick = () => {
    navigate('/chat');
  };

  const buttonStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    backgroundColor: 'green',
    color: 'white',
    border: 'none',
    cursor: 'pointer'
  };

  return (
    <button style={buttonStyle} onClick={handleChatClick}>
      AI Assistant Help
    </button>
  );
}

export default ChatButton;
