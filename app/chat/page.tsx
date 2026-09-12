"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, Sparkles, StopCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useAppStore } from "@/lib/store";
import { getCityData } from "@/lib/cityData";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

export default function ChatScreen() {
  const { currentCity } = useAppStore();
  const cityData = getCityData(currentCity);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Namaskara! 🙏 I'm Vanara AI for ${cityData.name}. Ask me about ${cityData.transitAuthorities.bus} routes, ${cityData.transitAuthorities.metro} timings, or just tap the mic and speak!`,
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
        body: JSON.stringify({ message: text, cityId: currentCity })
      });
      
      const data = await response.json();
      const botMsg: Message = { id: Date.now() + 1, text: data.reply, sender: "bot" };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = { id: Date.now() + 1, text: "Sorry, my neural link to BMTC servers timed out. Try again?", sender: "bot" };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      if (inputText) {
        handleSendMessage(inputText);
      }
    } else {
      setIsListening(true);
      // Simulate speech to text for demo
      setTimeout(() => {
        setInputText("Is there a women-only bus to Silk Board?");
      }, 1500);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 relative">
      {/* Header */}
      <div className="p-4 pt-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-1 z-10 shadow-sm">
        <h2 className="text-[10px] text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] font-bold flex items-center gap-1">
          <Sparkles size={10} /> Vanara AI Assistant
        </h2>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white leading-none">Chat</h1>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4 pb-32">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-3 max-w-[85%] shadow-sm ${
              msg.sender === "bot" 
                ? "bg-white dark:bg-slate-900 rounded-2xl rounded-tl-sm border border-slate-200 dark:border-slate-800 self-start text-slate-700 dark:text-slate-200" 
                : "bg-emerald-500 rounded-2xl rounded-tr-sm border border-emerald-400 self-end text-white"
            }`}
          >
            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
          </motion.div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="flex flex-col gap-2 mb-4 px-4 absolute bottom-24 w-full max-w-md bg-gradient-to-t from-slate-50 dark:from-slate-950 pt-8 pb-2">
        {quickPrompts.map((prompt, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }} 
            onClick={() => handleSendMessage(prompt)}
            disabled={isLoading}
            className="text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 py-2.5 px-4 rounded-full w-fit hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-white transition-colors disabled:opacity-50 shadow-sm"
          >
            {prompt}
          </motion.button>
        ))}
      </div>

      {/* Input Area */}
      <div className="absolute bottom-[90px] left-0 right-0 p-4 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleListening}
            className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all ${
              isListening 
                ? "bg-red-500 animate-pulse text-white" 
                : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            }`}
          >
            {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
          </button>
          
          <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center px-4 h-12 shadow-sm focus-within:border-emerald-500 transition-colors">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400"
            />
            {isLoading ? (
              <Loader2 size={18} className="text-emerald-500 animate-spin" />
            ) : (
              <button 
                onClick={() => handleSendMessage(inputText)}
                disabled={!inputText.trim()}
                className="text-emerald-500 disabled:text-slate-300 dark:disabled:text-slate-700 disabled:bg-transparent bg-emerald-50 dark:bg-emerald-900/30 p-1.5 rounded-full transition-colors"
              >
                <Send size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}