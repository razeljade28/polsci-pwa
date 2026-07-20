import React, { useState, useRef, useEffect } from "react";
import { ChatMessage, Member } from "../types";
import { Send, Bot, User, Sparkles, AlertCircle, Compass } from "lucide-react";

interface ConstitutionalAdvisorProps {
  member: Member;
}

const LOCAL_CONSTITUTION_ANSWERS: { [key: string]: string } = {
  "malolos": "The 1899 Malolos Constitution was the first republican constitution in Asia. It established a democratic government with a strong unicameral legislature (Assembly of Representatives) and a President elected by the legislature. Key features included a separation of church and state, a detailed Bill of Rights, and temporary provisions giving wide power to President Emilio Aguinaldo during the war.",
  "1973": "The 1973 Constitution was promulgated during the presidency of Ferdinand Marcos. It officially shifted the Philippines from a presidential system to a parliamentary one, where the Prime Minister served as the head of government and the President as the symbolic head of state. It was amended several times to grant legislative powers to the President through Amendment No. 6.",
  "1987": "The 1987 Constitution is the current supreme law of the Philippines. Promulgated after the 1986 EDSA People Power Revolution, it restored a presidential form of government with a bicameral legislature (Senate and House of Representatives) and an independent judiciary. It features strong safeguards against dictatorship, a robust Bill of Rights (Article III), and a strict 6-year single term limit for the President.",
  "amend": "Under Article XVII of the 1987 Constitution, amendments or revisions can be proposed via three methods:\n1. Constituent Assembly (Con-Ass): Congress, upon three-fourths vote of all its members.\n2. Constitutional Convention (Con-Con): By a majority vote of Congress, or by calling an election of delegates.\n3. People's Initiative: A petition of at least 12% of total registered voters, with every legislative district represented by at least 3%. All changes must be ratified in a national plebiscite.",
  "bill of rights": "Article III of the 1987 Constitution outlines the Bill of Rights. Key protections include:\n• Section 1: Due process of law and equal protection of the laws.\n• Section 2: Protection against unreasonable searches and seizures.\n• Section 3: Privacy of communication and correspondence.\n• Section 4: Freedom of speech, expression, and of the press.\n• Section 8: Right to form unions and associations."
};

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

      let replyText = "";
      let isLocalFallback = false;

      try {
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

        if (response.ok) {
          const data = await response.json();
          replyText = data.text;
        } else {
          isLocalFallback = true;
        }
      } catch (fetchErr) {
        isLocalFallback = true;
      }

      if (isLocalFallback) {
        // Keyword analyzer for local static guides
        const queryLower = text.toLowerCase();
        let matchedTopic = "";

        if (queryLower.includes("malolos") || queryLower.includes("1899")) {
          matchedTopic = "malolos";
        } else if (queryLower.includes("1973") || queryLower.includes("marcos")) {
          matchedTopic = "1973";
        } else if (queryLower.includes("1987") || queryLower.includes("current") || queryLower.includes("present")) {
          matchedTopic = "1987";
        } else if (queryLower.includes("amend") || queryLower.includes("revision") || queryLower.includes("initiative")) {
          matchedTopic = "amend";
        } else if (queryLower.includes("bill of rights") || queryLower.includes("article iii") || queryLower.includes("rights")) {
          matchedTopic = "bill of rights";
        }

        const basicAnswer = matchedTopic
          ? LOCAL_CONSTITUTION_ANSWERS[matchedTopic]
          : "The 1987 Philippine Constitution is the supreme law of the land. It establishes a democratic, presidential republic with a strict separation of powers among the Executive, Legislative, and Judicial branches.";

        replyText = `*(Static GitHub Pages Study Mode)*\n\n${basicAnswer}\n\n*Note: Since this is hosted as a static site on GitHub Pages, the live Gemini AI server is resting. In a live full-stack container deployment, this component connects directly to Gemini via a secure server proxy.*`;
      }

      const aiMessage: ChatMessage = {
        id: `msg-${Date.now()}-ai`,
        role: "model",
        text: replyText || "I was unable to formulate a response at the moment. Please try again.",
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
      <div className="bg-gradient-to-br from-dark-green via-primary-green to-dark-green p-4 text-white flex items-center justify-between border-b border-light-green/30">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-xl text-gold-start shadow animate-pulse">
            🎓
          </div>
          <div>
            <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5 font-display">
              Constitutional AI Advisor
              <Sparkles className="w-3.5 h-3.5 text-gold-start fill-gold-start animate-pulse" />
            </h3>
            <p className="text-[10px] text-gold-start font-semibold uppercase tracking-wider">Philippine Law & History Tutor</p>
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
                    ? "bg-primary-green text-gold-start"
                    : "bg-light-green"
                }`}
              >
                {isAi ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
                  isAi
                    ? "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-800 rounded-tl-none shadow-sm"
                    : "bg-primary-green text-white rounded-tr-none shadow-md"
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-[80%] mr-auto">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary-green text-gold-start shadow-sm animate-bounce">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3.5 rounded-2xl rounded-tl-none shadow-sm text-sm text-zinc-500 flex items-center gap-2">
              <div className="flex gap-1.5 items-center">
                <span className="w-2 h-2 bg-primary-green rounded-full animate-bounce delay-100" />
                <span className="w-2 h-2 bg-primary-green rounded-full animate-bounce delay-200" />
                <span className="w-2 h-2 bg-primary-green rounded-full animate-bounce delay-300" />
              </div>
              <span className="font-semibold text-primary-green/80 text-[11px] uppercase tracking-wider">Analyzing framework...</span>
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
          <p className="text-[10px] text-primary-green dark:text-light-green uppercase tracking-widest font-bold flex items-center gap-1.5 mb-2 px-1">
            <Compass className="w-3.5 h-3.5" />
            Suggested Quick Studies
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {suggestionPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="text-[11px] text-zinc-900 dark:text-zinc-100 hover:text-white hover:bg-primary-green bg-primary-green/10 dark:bg-primary-green/20 border border-primary-green/20 dark:border-primary-green/30 p-2.5 rounded-xl text-left transition-all font-semibold shadow-sm flex items-center gap-1.5 cursor-pointer leading-tight"
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
          className="flex-1 px-4 py-3 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/10 text-zinc-900 dark:text-zinc-100 font-semibold"
        />
        <button
          onClick={() => handleSendMessage(input)}
          disabled={!input.trim() || isLoading}
          className="w-12 h-12 bg-primary-green hover:bg-light-green text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-md hover:shadow-lg active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
