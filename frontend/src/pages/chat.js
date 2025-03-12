import React, { useState } from 'react';

function ChatInterface() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  // Handle text input change
  const handleTextChange = (e) => {
    setInputText(e.target.value);
  };

  // Handle chat submission and stream the response
  const handleSubmit = async () => {
    if (inputText.trim()) {
      setIsLoading(true);
      setResult(''); // Clear previous result

      try {
        const response = await fetch(`${backendUrl}/api/restaurants/chat`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: inputText }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        let done = false;
        let accumulatedResult = '';

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            lines.forEach((line) => {
              if (line.startsWith('data:')) {
                const data = line.replace('data: ', '').trim();

                // Check for the end of the stream
                if (data === '[DONE]') {
                  setIsLoading(false);
                  return;
                }

                try {
                  // Parse JSON if it's not "[DONE]"
                  const parsedData = JSON.parse(data);
                  if (parsedData.response) {
                    accumulatedResult += parsedData.response;
                    setResult(accumulatedResult);
                  }
                } catch (err) {
                  console.error('Error parsing JSON chunk:', err);
                }
              }
            });
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error during streaming:', error);
        setIsLoading(false);
        setResult('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div style={{
      backgroundColor: 'white', // ✅ White background
      color: 'black',
      fontFamily: 'Monospace',
      textAlign: 'center',
      minHeight: '100vh',
      padding: '20px'
    }}>
      <h1 style={{
      fontSize: '3rem', 
      fontFamily: 'lucida-console', // ✅ Same font style as in the image
      color: '#2E7D32', // ✅ Green color
      fontWeight: 'normal', // ✅ Matches the elegance
      marginBottom: '20px'
    }}>
      AI Restaurant Assistant
    </h1>

      <div>
        <textarea
          value={inputText}
          onChange={handleTextChange}
          placeholder="Type your question here..."
          rows="5"
          cols="50"
          disabled={isLoading}
          style={{
            width: '80%',
            maxWidth: '600px',
            height: '100px',
            backgroundColor: 'white', // ✅ White input box
            color: 'black',
            border: '2px solid #388E3C', // ✅ Green border
            padding: '10px',
            fontSize: '1rem',
            borderRadius: '5px'
          }}
        />
      </div>

      <button 
        onClick={handleSubmit} 
        disabled={isLoading}
        style={{
          backgroundColor: isLoading ? '#66BB6A' : '#388E3C', // ✅ Green button
          color: 'white',
          fontSize: '1.2rem',
          padding: '10px 20px',
          marginTop: '10px',
          border: 'none',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          borderRadius: '5px',
          transition: '0.3s'
        }}
      >
        {isLoading ? 'Waiting for response...' : 'Send'}
      </button>

      <div>
        <h2 style={{ fontSize: '1.5rem', marginTop: '20px' }}>Answer:</h2>
        <pre style={{
          backgroundColor: '#f5f5f5', // ✅ Light grey response box
          padding: '15px',
          width: '80%',
          maxWidth: '600px',
          borderRadius: '5px',
          fontSize: '1rem',
          color: 'black',
          whiteSpace: 'pre-wrap',
          wordWrap: 'break-word',
          textAlign: 'left',
          margin: 'auto',
          border: '1px solid #ddd' // ✅ Subtle border
        }}>
          {result}
        </pre>
      </div>
    </div>
  );
}

export default ChatInterface;
