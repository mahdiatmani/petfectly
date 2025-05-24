"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart, MoreVertical, ArrowLeft, Paperclip, Mic, MicOff, Camera, Image, FileText } from 'lucide-react';

const PetfectlyChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there! 🐾 I'm here to help you find the perfect playmate for your pet. What kind of furry friend are you looking for?",
      sender: 'bot',
      timestamp: '2:30 PM'
    },
    {
      id: 2,
      text: "I have a golden retriever named Max and I'm looking for a playmate in my area!",
      sender: 'user',
      timestamp: '2:32 PM'
    },
    {
      id: 3,
      text: "That's wonderful! Golden retrievers are such friendly dogs 🐕 What size playmate would be best for Max? And what's your location?",
      sender: 'bot',
      timestamp: '2:33 PM'
    }
  ]);
  
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef(null);
  const recordingIntervalRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    setRecordingTime(0);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
    }
    
    // Simulate voice message
    const voiceMessage = {
      id: messages.length + 1,
      text: "🎤 Voice message",
      type: 'voice',
      duration: recordingTime,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, voiceMessage]);
    
    // Bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "I heard your voice message! That sounds great. 🎧",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleAttachment = (type) => {
    setShowAttachments(false);
    let attachmentMessage;
    
    switch(type) {
      case 'photo':
        attachmentMessage = {
          id: messages.length + 1,
          text: "📷 Photo of my pet",
          type: 'image',
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        break;
      case 'camera':
        attachmentMessage = {
          id: messages.length + 1,
          text: "📸 New photo taken",
          type: 'image',
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        break;
      case 'document':
        attachmentMessage = {
          id: messages.length + 1,
          text: "📄 Pet medical records.pdf",
          type: 'document',
          sender: 'user',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        break;
      default:
        return;
    }
    
    setMessages([...messages, attachmentMessage]);
    
    // Bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: "Thanks for sharing! That's really helpful information. 📋",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          text: "Thanks for sharing! Let me help you find some great matches for Max. 🎾",
          sender: 'bot',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-400 to-red-400 px-4 py-4 flex items-center justify-between text-white">
        <div className="flex items-center space-x-3">
          <ArrowLeft className="w-6 h-6" />
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              🐾
            </div>
            <div>
              <h1 className="font-semibold text-lg">Petfectly</h1>
              <p className="text-xs opacity-90">Find your pet's perfect match</p>
            </div>
          </div>
        </div>
        <MoreVertical className="w-6 h-6" />
      </div>

      {/* Messages */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
              message.sender === 'user'
                ? 'bg-gradient-to-r from-pink-400 to-red-400 text-white'
                : 'bg-white border border-gray-200 text-gray-800'
            }`}>
              {message.type === 'voice' ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <Mic className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 h-1 bg-white/30 rounded-full">
                        <div className="h-1 bg-white rounded-full w-1/3"></div>
                      </div>
                      <span className="text-xs">{message.duration}s</span>
                    </div>
                  </div>
                </div>
              ) : message.type === 'image' ? (
                <div className="flex items-center space-x-2">
                  <Image className="w-5 h-5" />
                  <span className="text-sm">{message.text}</span>
                </div>
              ) : message.type === 'document' ? (
                <div className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span className="text-sm">{message.text}</span>
                </div>
              ) : (
                <p className="text-sm">{message.text}</p>
              )}
              <p className={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
              }`}>
                {message.timestamp}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-200">
        {/* Attachment Menu */}
        {showAttachments && (
          <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAttachment('camera')}
                className="flex flex-col items-center space-y-2 p-3 bg-white rounded-xl hover:bg-pink-50 transition-colors"
              >
                <Camera className="w-6 h-6 text-pink-500" />
                <span className="text-xs text-gray-600">Camera</span>
              </button>
              <button
                onClick={() => handleAttachment('photo')}
                className="flex flex-col items-center space-y-2 p-3 bg-white rounded-xl hover:bg-pink-50 transition-colors"
              >
                <Image className="w-6 h-6 text-pink-500" />
                <span className="text-xs text-gray-600">Photo</span>
              </button>
              <button
                onClick={() => handleAttachment('document')}
                className="flex flex-col items-center space-y-2 p-3 bg-white rounded-xl hover:bg-pink-50 transition-colors"
              >
                <FileText className="w-6 h-6 text-pink-500" />
                <span className="text-xs text-gray-600">Document</span>
              </button>
            </div>
          </div>
        )}

        {/* Recording Indicator */}
        {isRecording && (
          <div className="mb-4 flex items-center justify-center space-x-3 p-3 bg-red-50 rounded-2xl">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">Recording... {recordingTime}s</span>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          {/* Attachment Button */}
          <button
            onClick={() => setShowAttachments(!showAttachments)}
            className={`p-3 rounded-full transition-all duration-200 ${
              showAttachments 
                ? 'bg-pink-100 text-pink-600' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRecording ? "Recording voice message..." : "Type your message..."}
              disabled={isRecording}
              className={`w-full px-4 py-3 bg-gray-100 rounded-full border-none outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all duration-200 ${
                isRecording ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            />
          </div>

          {/* Voice/Send Button */}
          {inputText.trim() ? (
            <button
              onClick={handleSendMessage}
              className="p-3 rounded-full bg-gradient-to-r from-pink-400 to-red-400 text-white hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <Send className="w-5 h-5" />
            </button>
          ) : (
            <button
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`p-3 rounded-full transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
        </div>
        
        {/* Quick Actions */}
        <div className="flex items-center justify-center mt-3 space-x-4">
          <button className="flex items-center space-x-1 px-3 py-2 bg-pink-50 text-pink-600 rounded-full text-sm hover:bg-pink-100 transition-colors">
            <Heart className="w-4 h-4" />
            <span>Find Matches</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 bg-pink-50 text-pink-600 rounded-full text-sm hover:bg-pink-100 transition-colors">
            <span>🐕</span>
            <span>Dog Parks</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-2 bg-pink-50 text-pink-600 rounded-full text-sm hover:bg-pink-100 transition-colors">
            <span>📍</span>
            <span>Nearby</span>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-3 text-xs text-gray-500 bg-white">
        © 2025 Petfectly. Find the perfect playdate for your furry friend.
      </div>
    </div>
  );
};

export default PetfectlyChat;