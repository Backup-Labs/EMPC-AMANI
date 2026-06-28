"use client";

import React, { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initializ with a welcome message on mount or first open
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content:
            "Hi! I'm the EMPC assistant. Ask me about our furniture, custom orders, or carpentry training programs.",
        },
      ]);
    }
  }, [messages.length]);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err: any) {
      console.error("Chat widget error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an issue sending your message. Please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-24 right-6 z-50 h-[56px] w-[56px] rounded-full bg-primary text-background flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform duration-300 cursor-pointer"
        aria-label="Open chat assistant"
      >
        {open ? <i className="fa-solid fa-xmark text-[22px]"></i> : <i className="fa-solid fa-robot text-[22px]"></i>}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-44 right-6 z-50 w-80 h-[480px] max-h-[75vh] flex flex-col bg-background border border-border rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
          {/* Header */}
          <div className="bg-primary text-background px-4 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="font-black text-sm uppercase tracking-wider">EMPC Assistant</span>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-background/80 hover:text-background transition-colors flex items-center justify-center"
              aria-label="Close chat"
            >
              <i className="fa-solid fa-xmark text-base"></i>
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 scrollbar-thin scrollbar-thumb-border">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm font-medium leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-background self-end rounded-br-none"
                    : "bg-muted text-foreground self-start rounded-bl-none border border-border/40"
                }`}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="bg-muted text-foreground border border-border/40 self-start rounded-2xl rounded-bl-none px-4 py-3 flex gap-1.5 items-center">
                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.3s]" />
                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce [animation-delay:-0.15s]" />
                <span className="h-2 w-2 rounded-full bg-foreground/40 animate-bounce" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 border-t border-border bg-background flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              disabled={loading}
              className="flex-1 h-10 px-4 rounded-full border border-border text-xs font-bold bg-background/50 focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="h-10 w-10 bg-primary text-background rounded-full flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50 shrink-0 cursor-pointer"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      )}
    </>
  );
}
