import React, { useState, useEffect, useRef } from 'react';

const SpeechRecognitionComponent = () => {
  const [voiceInput, setVoiceInput] = useState('');
  const [responseOutput, setResponseOutput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please try a different browser.');
      return;
    }
    
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript;
      setVoiceInput(result);
      sendDataToBackend(result);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const startListening = () => {
    if (recognitionRef.current) {
      setLoading(true);
      recognitionRef.current.start();
    }
  };

  const sendDataToBackend = (data) => {
    fetch('http://127.0.0.1:5000/api/process_voice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ voiceData: data }),
    })
      .then((response) => response.json())
      .then((responseData) => {
        setResponseOutput(responseData.message || '');
        speakMessage(responseData.message || '');
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    setLoading(false);
  };

  const speakMessage = (message) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    } else {
      console.log('Text-to-speech is not supported in this browser.');
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h1>SpeakBuddy Speech Recognition Project</h1>
      <input
        type="text"
        value={voiceInput}
        placeholder={isListening ? 'Listening...' : 'Speak something...'}
        onChange={(e) => setVoiceInput(e.target.value)}
        style={{ width: '60%', padding: '10px', marginBottom: '20px' }}
        readOnly
      />
      <br />
      <p>Ask "tell me about Germany (or, India, Bangladesh, Pakistan and Nepal) in different way</p>
      <br />
      <button
        onClick={startListening}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
        disabled={isListening}
      >
        {isListening ? 'Listening...' : 'Start Listening'}
      </button>
      <br />
      <br />
      {loading ? (
        <>
          <div id="responseOutput" style={{ padding: '20px', marginTop: '20px', fontSize: '14px' }}>
            <i className="fa-solid fa-spinner fa-spin" style={{fontSize: "20px"}}></i>
          </div>
        </>
      ):(
        <>
          <div id="responseOutput" style={{ padding: '20px', marginTop: '20px', fontSize: '14px' }}>
            {responseOutput && `SpeakBuddy: "${responseOutput}"`}
          </div>
        </>
      )}
    </div>
  );
};

export default SpeechRecognitionComponent;