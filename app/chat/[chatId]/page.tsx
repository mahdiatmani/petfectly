"use client";
import React, { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import {
  Send,
  Heart,
  MoreVertical,
  ArrowLeft,
  Paperclip,
  Mic,
  MicOff,
  Camera,
  Image,
  FileText,
} from "lucide-react";

const API_BASE_URL = "http://localhost:5000";

const PetfectlyChat = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timer | null>(null);

  // TODO: replace this with your real auth/user context
  const userId = "33";

  // ── Load existing chat ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!chatId) return;
    fetch(`${API_BASE_URL}/api/chats/${chatId}`)
      .then((res) => res.json())
      .then((data) => {
        setMessages(data.messages);
      });
  }, [chatId]);

  // ── Auto-scroll on new messages ────────────────────────────────────────────────
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Voice recording handlers ─────────────────────────────────────────────────
  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingTime((t) => t + 1);
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recordingIntervalRef.current) {
      clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
    // simulate sending a voice message locally
    const voiceMsg = {
      _id: `tmp-${Date.now()}`,
      sender: userId,
      type: "voice",
      duration: recordingTime,
      text: "🎤 Voice message",
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, voiceMsg]);
    setRecordingTime(0);
  };

  // ── Simple attachment simulator ───────────────────────────────────────────────
  const handleAttachment = (type: "photo" | "camera" | "document") => {
    setShowAttachments(false);
    let msg: any;
    const base = {
      _id: `tmp-${Date.now()}`,
      sender: userId,
      timestamp: new Date().toISOString(),
    };

    if (type === "photo") {
      msg = { ...base, type: "image", text: "📷 Photo of my pet" };
    } else if (type === "camera") {
      msg = { ...base, type: "image", text: "📸 New photo taken" };
    } else {
      msg = { ...base, type: "document", text: "📄 Pet medical records.pdf" };
    }

    setMessages((m) => [...m, msg]);
  };

  // ── Send text message (persisted) ────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
    // optimistically add
    const newMsg = {
      _id: `tmp-${Date.now()}`,
      sender: userId,
      text: inputText,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, newMsg]);
    setInputText("");

    // persist to backend
    await fetch(`${API_BASE_URL}/api/chats/${chatId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId: userId, text: newMsg.text }),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
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
              <p className="text-xs opacity-90">Chat</p>
            </div>
          </div>
        </div>
        <MoreVertical className="w-6 h-6" />
      </div>

      {/* Messages List */}
      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto bg-gray-50">
        {messages.map((message, idx) => {
          const isOwn =
            (typeof message.sender === "string" && message.sender === userId) ||
            (message.sender?._id === userId);
          const time = new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          });
          return (
            <div
              key={message._id ?? idx}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                  isOwn
                    ? "bg-gradient-to-r from-pink-400 to-red-400 text-white"
                    : "bg-white border border-gray-200 text-gray-800"
                }`}
              >
                {message.type === "voice" ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                      <Mic className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 h-1 bg-white/30 rounded-full">
                          <div
                            className="h-1 bg-white rounded-full"
                            style={{ width: `${(message as any).duration}%` }}
                          ></div>
                        </div>
                        <span className="text-xs">{(message as any).duration}s</span>
                      </div>
                    </div>
                  </div>
                ) : message.type === "image" ? (
                  <div className="flex items-center space-x-2">
                    <Image className="w-5 h-5" />
                    <span className="text-sm">{message.text}</span>
                  </div>
                ) : message.type === "document" ? (
                  <div className="flex items-center space-x-2">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">{message.text}</span>
                  </div>
                ) : (
                  <p className="text-sm">{message.text}</p>
                )}
                <p
                  className={`text-xs mt-1 ${
                    isOwn ? "text-white/70" : "text-gray-500"
                  }`}
                >
                  {time}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input / Controls */}
      <div className="p-4 bg-white border-t border-gray-200">
        {showAttachments && (
          <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleAttachment("camera")}
                className="flex flex-col items-center space-y-2 p-3 bg-white rounded-xl hover:bg-pink-50 transition-colors"
              >
                <Camera className="w-6 h-6 text-pink-500" />
                <span className="text-xs text-gray-600">Camera</span>
              </button>
              <button
                onClick={() => handleAttachment("photo")}
                className="flex flex-col items-center space-y-2 p-3 bg-white rounded-xl hover:bg-pink-50 transition-colors"
              >
                <Image className="w-6 h-6 text-pink-500" />
                <span className="text-xs text-gray-600">Photo</span>
              </button>
              <button
                onClick={() => handleAttachment("document")}
                className="flex flex-col items-center space-y-2 p-3 bg-white rounded-xl hover:bg-pink-50 transition-colors"
              >
                <FileText className="w-6 h-6 text-pink-500" />
                <span className="text-xs text-gray-600">Document</span>
              </button>
            </div>
          </div>
        )}

        {isRecording && (
          <div className="mb-4 flex items-center justify-center space-x-3 p-3 bg-red-50 rounded-2xl">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-medium">
              Recording... {recordingTime}s
            </span>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAttachments((s) => !s)}
            className={`p-3 rounded-full transition-all duration-200 ${
              showAttachments
                ? "bg-pink-100 text-pink-600"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={
                isRecording ? "Recording voice message..." : "Type your message..."
              }
              disabled={isRecording}
              className={`w-full px-4 py-3 bg-gray-100 rounded-full outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white transition-all duration-200 ${
                isRecording ? "opacity-50 cursor-not-allowed" : ""
              }`}
            />
          </div>

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
                  ? "bg-red-500 text-white animate-pulse"
                  : "bg-gray-100 text-gray-600 hover:bg-pink-100 hover:text-pink-600"
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}
        </div>

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

      <div className="text-center py-3 text-xs text-gray-500 bg-white">
        © 2025 Petfectly. Find the perfect playdate for your furry friend.
      </div>
    </div>
  );
};

export default PetfectlyChat;
