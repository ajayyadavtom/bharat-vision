"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, Sparkles, StopCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function ChatScreen() {
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Namaskara guru! 🙏 I'm Vanara AI. Ask me about BMTC routes, Metro timings, or just tap the mic and speak!",
      sender: "bot"
    }
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const quickPrompts = [
    "Show me the route to Majestic",
    "What time is the last Purple Line metro?",
    "Why is 500D always late?",
  ];

  // REAL API CALL TO GEMINI BACKEND
  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now(), text, sender: "user" };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      
      const data = await response.json();
      const botMsg: Message = { id: Date.now() + 1, text: data.reply, sender: "bot" };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const botMsg: Message = { id: Date.now() + 1, text: "Network issue, guru. Try again.", sender: "bot" };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in this browser. Try Chrome!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; 
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      handleSendMessage(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech error:", event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => setIsListening(false);

    recognition.start();
  };

  return (
    <div className="flex flex-col h-screen max-h-screen pt-4 pb-20 px-4 bg-surface-black relative">
      
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-brand-accent" size={20} />
        <h1 className="text-lg font-bold text-white tracking-wide">Vanara AI</h1>
        {isLoading && <Loader2 size={14} className="text-gray-400 animate-spin ml-2" />}
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-4 pb-4">
        {messages.map((msg) => (
          <motion.div 
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 max-w-[85%] shadow-md ${
              msg.sender === "bot" 
                ? "bg-surface-dark rounded-2xl rounded-tl-sm border border-brand-dark self-start text-gray-200" 
                : "bg-brand-dark rounded-2xl rounded-tr-sm border border-brand-base self-end text-white"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex flex-col gap-2 mb-4">
        {quickPrompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }} 
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-left bg-surface-dark/50 border border-brand-dark text-xs text-gray-300 py-2.5 px-4 rounded-full w-fit hover:bg-brand-dark hover:text-white transition-colors disabled:opacity-50"
          >
            {prompt}
          </motion.button>
        ))}
      </div>

      <div className={`flex items-center gap-2 p-2 rounded-full border transition-colors shadow-lg mb-2 ${
        isListening ? "bg-alert-red/10 border-alert-red" : "bg-surface-dark border-brand-base focus-within:border-brand-accent"
      }`}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
          placeholder={isListening ? "Listening..." : "Message Vanara — say hi..."}
          disabled={isListening || isLoading}
          className="flex-1 bg-transparent text-white text-sm px-3 outline-none placeholder-gray-500 disabled:opacity-50"
        />
        
        {inputText.length > 0 ? (
          <button 
            onClick={() => handleSendMessage(inputText)}
            disabled={isLoading}
            className="bg-brand-accent p-2.5 rounded-full text-brand-dark hover:scale-105 transition-transform disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        ) : (
          <button 
            onClick={toggleListening}
            disabled={isLoading}
            className={`p-2.5 rounded-full hover:scale-105 transition-transform border disabled:opacity-50 ${
              isListening 
                ? "bg-alert-red text-white border-red-400 animate-pulse" 
                : "bg-brand-dark text-brand-accent border-brand-base"
            }`}
          >
            {isListening ? <StopCircle size={18} /> : <Mic size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}