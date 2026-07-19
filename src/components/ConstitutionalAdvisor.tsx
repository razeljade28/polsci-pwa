import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Member } from "../types";
import { Send, Bot, User, Sparkles, AlertCircle, Compass } from "lucide-react";

interface ConstitutionalAdvisorProps {
  member: Member;
}

export const ConstitutionalAdvisor: React.FC<ConstitutionalAdvisorProps> = ({ member }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: `Hello ${member.name.split(" ")[0]}! I am your AI Constitutional & Political Science Advisor. 📜\n\nYou can ask me questions about Philippine constitutional history, civic governance, the differences between historical frameworks (1899 to 1987), or any political science exam topics! How can I help you study today?`,
      createdAt: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionPrompts = [
    "Summarize the 1899 Malolos Constitution",
    "Compare the 1973 and 1987 Constitutions",
    "Explain Article III (Bill of Rights) of 1987",
    "How is the 1987 Constitution amended?"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setErrorMsg(null);

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      text,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Build history for context
      const chatHistory = messages
        .filter(m => m.id !== "welcome")
        .slice(-6) // Send last 6 messages as context
        .map(m => ({
          role: m.role,
          text: m.text
        }));

      const response = await fetch("/api/gemini/advisor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text,
          history: chatHistory
        })
      });

      if (!response.ok) {
        throw new Error("Unable to contact the AI server. Please try again.");
      }

      const data = await response.json();

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "model",
        text: data.text || "I was unable to formulate a response at the moment. Please try again.",
        createdAt: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md overflow-hidden flex flex-col h-[520px] transition-all hover:shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-xl text-yellow-300 shadow">
            🎓
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 font-display">
              Constitutional AI Advisor
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 fill-yellow-300 animate-pulse" />
            </h3>
            <p className="text-[10px] text-blue-100 font-semibold uppercase tracking-wider">Philippine Law & History Tutor</p>
          </div>
        </div>
        <span className="text-[10px] px-2.5 py-1 bg-white/15 rounded-full font-bold uppercase tracking-wider">
          Gemini 2.5
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-50 dark:bg-zinc-950">
        {messages.map((m) => {
          const isAi = m.role === "model";
          return (
            <div
              key={m.id}
              className={`flex gap-3 max-w-[85%] ${isAi ? "mr-auto" : "ml-auto flex-row-reverse"}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm ${
                  isAi
                    ? "bg-blue-600 text-yellow-300"
                    : "bg-indigo-600"
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isAi
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-tl-none shadow-sm"
                    : "bg-blue-600 text-white rounded-tr-none shadow-md"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-blue-600 text-yellow-300 shadow-sm animate-bounce">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-zinc-500 flex items-center gap-2">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-200" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-bounce delay-300" />
              </div>
              <span className="font-semibold text-blue-600/80 text-[11px] uppercase tracking-wider">Analyzing framework...</span>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 p-3.5 rounded-xl text-xs border border-red-200/50 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <p className="font-medium">{errorMsg}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts Grid */}
      {messages.length === 1 && !isLoading && (
        <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
          <p className="text-[10px] text-blue-600 dark:text-blue-400 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-2 px-1">
            <Compass className="w-3.5 h-3.5" />
            Suggested Quick Studies
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {suggestionPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="text-[11px] text-zinc-900 dark:text-zinc-100 hover:text-white hover:bg-blue-600 bg-blue-50 dark:bg-blue-950/10 border border-blue-100/40 dark:border-blue-900/40 p-2.5 rounded-xl text-left transition-all font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer leading-tight"
              >
                🎓 {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage(input)}
          placeholder="Ask a constitutional law question..."
          className="flex-1 px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 text-zinc-900 dark:text-zinc-100 font-semibold"
        />
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || isLoading}
          className="w-12 h-12 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
