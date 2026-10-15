"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Send, Sparkles, StopCircle, Loader2, Menu, X, PlusCircle, MessageSquare, Trash2, Camera } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore, ChatMessage } from "@/lib/store";
import { getCityData } from "@/lib/cityData";
import { generateOfflineTransitReply } from "@/lib/offlineTransitEngine";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatScreen() {
  const { appLang, currentCity, chatMessages, chatSessions, addChatMessage, startNewChat, loadChatSession, deleteChatSession } = useAppStore();
  const cityData = getCityData(currentCity);
  const [inputText, setInputText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Monitor network online/offline state
  useEffect(() => {
    setIsOnline(typeof navigator !== "undefined" ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);
  
  // Set initial welcome message if empty
  useEffect(() => {
    if (chatMessages.length === 0) {
      addChatMessage({
        id: Date.now(),
        text: `Namaskara! 🙏 I'm Vanara AI. Ask me about transit routes, timings, or take a picture of your surroundings!`,
        sender: "bot"
      });
    }
  }, [chatMessages.length, addChatMessage, cityData]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  const quickPrompts = [
    "Show me the route to Majestic",
    "What time is the last Purple Line metro?",
    "Why is 500D always late?",
  ];

  const handleSendMessage = async (text: string, imageBase64?: string) => {
    if (!text.trim() && !imageBase64) return;

    const userMsg: ChatMessage = { id: Date.now(), text, sender: "user", image: imageBase64 };
    addChatMessage(userMsg);
    setInputText("");
    setIsLoading(true);

    // 1. Instant on-device execution if currently offline
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setTimeout(() => {
        const offlineReply = generateOfflineTransitReply(text || "Where am I?", appLang, currentCity);
        const botMsg: ChatMessage = { id: Date.now() + 1, text: offlineReply, sender: "bot" };
        addChatMessage(botMsg);
        setIsLoading(false);
        setIsListening(false);
      }, 350);
      return;
    }

    try {
      // Get the last 6 messages for context memory (excluding the one we just added since it's sent explicitly)
      const recentHistory = chatMessages.slice(-6).map(m => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text, 
          imageBase64, 
          cityId: currentCity, 
          appLang,
          history: recentHistory
        })
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status ${response.status}`);
      }

      const data = await response.json();
      if (!data.reply) {
        throw new Error("Empty response received from chat API");
      }

      const botMsg: ChatMessage = { id: Date.now() + 1, text: data.reply, sender: "bot" };
      addChatMessage(botMsg);
    } catch (error) {
      console.warn("Online API unavailable, seamlessly falling back to local on-device transit engine:", error);
      const offlineReply = generateOfflineTransitReply(text || "Where am I?", appLang, currentCity);
      const fallbackMsg: ChatMessage = { id: Date.now() + 1, text: offlineReply, sender: "bot" };
      addChatMessage(fallbackMsg);
    } finally {
      setIsLoading(false);
      setIsListening(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Compress image to avoid UI freeze and 413 Payload Too Large
    const img = new Image();
    const reader = new FileReader();
    
    reader.onload = (event) => {
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 800;
        const scaleSize = img.width > MAX_WIDTH ? MAX_WIDTH / img.width : 1;
        canvas.width = img.width * scaleSize;
        canvas.height = img.height * scaleSize;
        
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Convert back to base64 with lower quality (0.7)
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        handleSendMessage("Where am I? What should I do next?", compressedBase64);
      };
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please type your message.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN"; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setInputText("");
    };

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setInputText(speechResult);
      handleSendMessage(speechResult);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="flex flex-col h-[100dvh] md:h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden md:max-w-4xl md:mx-auto md:w-full">
      
      <input 
        type="file" 
        accept="image/*" 
        capture="environment" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        className="hidden" 
      />

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }} transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="absolute top-0 bottom-0 left-0 w-3/4 max-w-sm bg-white dark:bg-slate-900 shadow-2xl z-50 flex flex-col border-r border-slate-200 dark:border-slate-800"
            >
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1.5 flex items-center justify-center shadow-xs">
                    <img src="/vanara-logo.png" alt="Vanara AI" className="w-full h-full object-contain dark:invert" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-slate-900 dark:text-white leading-tight">Vanara AI</h2>
                    <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Conversations</p>
                  </div>
                </div>
                <button onClick={() => setIsSidebarOpen(false)} className="text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <button 
                  onClick={() => { startNewChat(); setIsSidebarOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-xl py-3 font-bold text-sm active:scale-95 transition-all"
                >
                  <PlusCircle size={18} /> New Conversation
                </button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-2">
                {chatSessions.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center mt-4">No previous conversations.</p>
                ) : (
                  chatSessions.map(session => (
                    <div key={session.id} className="flex items-center gap-1 group">
                      <button
                        onClick={() => { loadChatSession(session.id); setIsSidebarOpen(false); }}
                        className="flex-1 flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                      >
                        <MessageSquare size={16} className="text-slate-400 shrink-0" />
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{session.title}</p>
                          <p className="text-[10px] text-slate-400">{new Date(session.updatedAt).toLocaleDateString()}</p>
                        </div>
                      </button>
                      <button 
                        onClick={() => deleteChatSession(session.id)}
                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors shrink-0"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 pt-8 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-slate-100 dark:from-emerald-950/40 dark:via-slate-800 dark:to-slate-900 border border-emerald-500/30 flex items-center justify-center p-2 shadow-sm">
              <img src="/vanara-logo.png" alt="Vanara AI" className="w-full h-full object-contain dark:invert" />
            </div>
            <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-amber-500"} border-2 border-white dark:border-slate-900 rounded-full`} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-black tracking-tight text-slate-900 dark:text-white">Vanara AI</h1>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold ${isOnline ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"} rounded-full border uppercase tracking-wider`}>
                {isOnline ? "Assistant" : "Offline DB"}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles size={10} className={isOnline ? "text-emerald-500" : "text-amber-500"} /> 
              {isOnline ? "Transit Intelligence • Online" : "On-Device Transit Engine • Offline"}
            </p>
          </div>
        </div>
        <button onClick={() => setIsSidebarOpen(true)} className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-inner">
          <Menu size={20} />
        </button>
      </div>

      {/* Chat Area */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto no-scrollbar p-4 flex flex-col gap-4 scroll-smooth">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 items-end ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.sender === "bot" && (
              <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 border border-emerald-500/30 flex items-center justify-center p-1.5 shrink-0 mb-0.5 shadow-xs">
                <img src="/vanara-logo.png" alt="Vanara AI" className="w-full h-full object-contain dark:invert" />
              </div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`max-w-[82%] rounded-2xl p-4 shadow-sm border ${
                msg.sender === "user" 
                  ? "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white rounded-br-sm" 
                  : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30 text-emerald-900 dark:text-emerald-100 rounded-bl-sm"
              }`}
            >
              {msg.image && (
                <img src={msg.image} alt="User upload" className="w-full rounded-xl mb-3 border border-slate-200 dark:border-slate-700" />
              )}
              {msg.sender === "bot" ? (
                <div className="prose prose-sm dark:prose-invert max-w-none prose-p:leading-relaxed prose-pre:bg-slate-100 dark:prose-pre:bg-slate-800 prose-pre:border prose-pre:border-slate-200 dark:prose-pre:border-slate-700">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.text}</ReactMarkdown>
                </div>
              ) : (
                <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
              )}
            </motion.div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-2 items-end justify-start">
            <div className="w-7 h-7 rounded-xl bg-white dark:bg-slate-800 border border-emerald-500/30 flex items-center justify-center p-1.5 shrink-0 mb-0.5 shadow-xs">
              <img src="/vanara-logo.png" alt="Vanara AI" className="w-full h-full object-contain dark:invert animate-pulse" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="max-w-[82%] rounded-2xl p-4 shadow-sm border bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/30 self-start rounded-bl-sm"
            >
              <div className="flex items-center gap-1.5 h-5">
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0 }}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                />
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                />
                <motion.div 
                  animate={{ y: [0, -5, 0] }} 
                  transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }}
                  className="w-2 h-2 bg-emerald-500 rounded-full"
                />
              </div>
            </motion.div>
          </div>
        )}
      </div>

      {/* Bottom Area: Quick Prompts + Input (Normal Flow, No Overlap) */}
      <div className="flex flex-col bg-slate-50 dark:bg-slate-950 pb-[72px] md:pb-4 shadow-[0_-10px_20px_rgba(0,0,0,0.03)] dark:shadow-[0_-10px_20px_rgba(0,0,0,0.2)] z-10">
        
        {/* Quick Prompts */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 py-3">
          {quickPrompts.map((prompt, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }} 
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="whitespace-nowrap shrink-0 text-left bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-600 dark:text-slate-300 py-2 px-4 rounded-full hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-white transition-colors disabled:opacity-50 shadow-sm"
            >
              {prompt}
            </motion.button>
          ))}
        </div>

        {/* Input Area */}
        <div className="px-4 pb-2">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
              className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              <Camera size={20} />
            </button>
            <button 
              onClick={toggleListening}
              disabled={isLoading}
              className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm transition-all disabled:opacity-50 ${
                isListening 
                  ? "bg-red-500 animate-pulse text-slate-900 dark:text-white" 
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {isListening ? <StopCircle size={20} /> : <Mic size={20} />}
            </button>
            
            <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] flex items-center px-4 min-h-[48px] shadow-sm focus-within:border-emerald-500 transition-colors">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(inputText)}
                placeholder="Message Vanara AI..."
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-white outline-none placeholder-slate-400 py-3"
              />
              {isLoading ? (
                <Loader2 size={18} className="text-emerald-500 animate-spin" />
              ) : (
                <button 
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim()}
                  className="text-emerald-500 disabled:text-slate-300 dark:disabled:text-slate-700 disabled:bg-transparent bg-emerald-50 dark:bg-emerald-900/30 p-1.5 rounded-full transition-colors shrink-0 ml-2"
                >
                  <Send size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}