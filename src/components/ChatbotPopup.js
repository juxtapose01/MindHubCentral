import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ChatbotPopup.css';
import { FaMicrophone, FaStop, FaPaperPlane, FaRobot, FaTimes } from 'react-icons/fa';

const ChatbotPopup = ({ onClose, isDarkMode }) => {
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your OSU MindHub assistant. How can I help you today? Try saying something like 'I feel stressed' or 'I'm anxious'.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  const cannedResponses = {
    stressed: "I'm sorry you're feeling stressed. Let's try a breathing exercise: inhale for 4 seconds, hold for 4 seconds, and exhale for 6 seconds. You can also visit our Exercises page for more. If you need more support, OSU Counseling is available at (405) 744-5458.",
    anxious: "Feeling anxious can be tough. Try focusing on the present moment—name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. If you'd like more help, the National Suicide Lifeline is at 988.",
    sad: "I'm here for you. Sometimes sharing how you feel can help—would you like to tell me more? You can also contact Stillwater Medical Center ER at (405) 372-1480 if you need immediate support.",
    default: "I'm here to help! Could you tell me more about how you're feeling? You can also check our Resources page for support options like OSU Counseling at (405) 744-5458."
  };

  const getCannedResponse = (userInput) => {
    const input = userInput.toLowerCase();
    if (input.includes('stress')) return cannedResponses.stressed;
    if (input.includes('anxious') || input.includes('anxiety')) return cannedResponses.anxious;
    if (input.includes('sad') || input.includes('depress')) return cannedResponses.sad;
    return cannedResponses.default;
  };

  const fetchAIResponse = useCallback(async (userInput) => {
    setIsLoading(true);
    
    try {
      const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
      const API_URL = process.env.REACT_APP_API_URL;
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a compassionate mental health assistant for Stillwater, Oklahoma residents. " +
                       "Provide helpful, supportive responses. When appropriate, mention these local resources: " +
                       "1. OSU Counseling (405-744-5458) " +
                       "2. National Suicide Lifeline (988) " +
                       "3. Stillwater Medical Center ER (405-372-1480)"
            },
            {
              role: "user",
              content: userInput
            }
          ],
          temperature: 0.7
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      return getCannedResponse(userInput);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSend = useCallback(async (text = input) => {
    if (text.trim() === '') return;

    const userMessage = { text, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    setMessages(prev => [...prev, { text: "Thinking...", sender: 'bot', isLoading: true }]);

    const aiResponse = await fetchAIResponse(text);
    
    setMessages(prev => prev.filter(msg => !msg.isLoading));
    setMessages(prev => [...prev, { text: aiResponse, sender: 'bot' }]);
  }, [input, fetchAIResponse]);

  const requestMicrophonePermission = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (error) {
      console.error('Microphone permission denied:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput('');
        handleSend(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setInput('');
        if (event.error === 'no-speech') {
          setMessages(prev => [...prev, { text: "No speech detected. Please try again.", sender: 'bot' }]);
        } else if (event.error === 'not-allowed') {
          setMessages(prev => [...prev, { text: "Microphone access denied. Please allow microphone permissions.", sender: 'bot' }]);
        }
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          setIsListening(false);
          setInput('');
        }
      };
    } else {
      console.warn('Speech recognition not supported');
      setMessages(prev => [...prev, { text: "Speech recognition is not supported in your browser.", sender: 'bot' }]);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [handleSend, isListening]);

  const toggleVoiceRecognition = useCallback(async () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInput('');
    } else {
      const hasPermission = await requestMicrophonePermission();
      if (hasPermission) {
        setIsListening(true);
        setInput('Listening...');
        try {
          recognitionRef.current.start();
        } catch (error) {
          console.error('Failed to start recognition:', error);
          setIsListening(false);
          setInput('');
          setMessages(prev => [...prev, { text: "Failed to start voice recognition. Please try again.", sender: 'bot' }]);
        }
      } else {
        setMessages(prev => [...prev, { text: "Microphone access is required for voice input. Please allow permissions.", sender: 'bot' }]);
      }
    }
  }, [isListening, requestMicrophonePermission]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className={`chatbot-popup ${isDarkMode ? 'dark' : 'light'}`}>
      <div className="chatbot-header">
        <div className="chatbot-title">
          <FaRobot className="bot-icon" />
          <h3>MindHub Assistant</h3>
        </div>
        <button className="close-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender} ${msg.isLoading ? 'loading' : ''}`}>
            {msg.isLoading ? (
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            ) : (
              msg.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chatbot-input-container">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            disabled={isListening || isLoading}
          />
          <button 
            className={`voice-btn ${isListening ? 'active' : ''}`}
            onClick={toggleVoiceRecognition}
            disabled={isLoading}
          >
            {isListening ? <FaStop /> : <FaMicrophone />}
          </button>
        </div>
        <button 
          className="send-btn" 
          onClick={() => handleSend()}
          disabled={isLoading || input.trim() === ''}
        >
          <FaPaperPlane />
        </button>
      </div>

      {isListening && (
        <div className="voice-status">
          <div className="pulse-ring"></div>
          Listening...
        </div>
      )}
    </div>
  );
};

export default ChatbotPopup;