'use client';
import { useState, useRef, useEffect, ChangeEvent } from 'react';
import { MessageCircle, Send, Image as ImageIcon, Mic } from 'lucide-react';

interface ChatMessage {
  id: number;
  sender: 'user' | 'bot';
  text?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'audio';
}

export default function ChatPage(): JSX.Element {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const sendTextMessage = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    const userMsg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      text: trimmed,
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    simulateBotResponse(trimmed);
  };

  const simulateBotResponse = (userText: string) => {
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: `Echo: ${userText}`,
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const msg: ChatMessage = {
      id: Date.now(),
      sender: 'user',
      attachmentUrl: url,
      attachmentType: file.type.startsWith('audio') ? 'audio' : 'image',
    };
    setMessages((prev) => [...prev, msg]);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (audioInputRef.current) audioInputRef.current.value = '';
    // optional bot reply
    simulateBotResponse(
      file.type.startsWith('audio') ? 'sent an audio message' : 'sent an image'
    );
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <header className="p-4 bg-gradient-to-r from-pink-400 to-purple-500 text-white">
        <h1 className="text-xl font-semibold">Petfectly Chat</h1>
      </header>

      <div ref={containerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {/* Avatar */}
            <img
              src={
                msg.sender === 'user'
                  ? '/images/user-avatar.png'
                  : '/images/bot-avatar.png'
              }
              alt="avatar"
              className="w-8 h-8 rounded-full"
            />

            {/* Message bubble */}
            <div
              className={`max-w-xs break-words p-2 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-blue-200 to-blue-100 self-end'
                  : 'bg-white shadow self-start'
              }`}
            >
              {msg.text && <p>{msg.text}</p>}
              {msg.attachmentType === 'image' && msg.attachmentUrl && (
                <img
                  src={msg.attachmentUrl}
                  alt="attachment"
                  className="mt-2 rounded"
                />
              )}
              {msg.attachmentType === 'audio' && msg.attachmentUrl && (
                <audio controls className="mt-2 w-full">
                  <source src={msg.attachmentUrl} />
                  Your browser does not support the audio element.
                </audio>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white flex items-center space-x-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label="Send image"
        >
          <ImageIcon size={24} className="text-gray-600" />
        </button>
        <button
          onClick={() => audioInputRef.current?.click()}
          aria-label="Send audio"
        >
          <Mic size={24} className="text-gray-600" />
        </button>
        <input
          type="file"
          accept="image/*,audio/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          type="file"
          accept="audio/*"
          ref={audioInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <MessageCircle size={24} className="text-gray-600" />
        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-300"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendTextMessage()}
        />
        <button
          onClick={sendTextMessage}
          className="transform rotate-90"
          aria-label="Send"
        >
          <Send size={24} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
}
