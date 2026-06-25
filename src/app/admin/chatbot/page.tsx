"use client";

import React, { useState, useEffect } from "react";
import { Bot, Save } from "lucide-react";
import { supabase } from "@/lib/supabase";

const DEFAULT_SYSTEM_PROMPT = `You are the helpful assistant for EMPC, a furniture and carpentry 
training company. You help website visitors with:
- Browsing furniture products and pricing inquiries
- Placing custom furniture orders
- Learning about vocational carpentry training programs (some government-sponsored)
- General contact and business information

Tone: friendly, professional, concise. If you cannot answer something specific, 
ask the visitor to contact EMPC directly via the contact page or WhatsApp.
Never make up prices, dates, or availability — instead direct them to inquire.
Always respond in the same language the visitor is using.`;

export default function AdminChatbotConfig() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchPrompt();
  }, []);

  const fetchPrompt = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "chatbot_system_prompt")
        .single();

      if (error && error.code !== "PGRST116") {
        // PGRST116 is PG single row not found
        throw error;
      }

      if (data && data.value) {
        setPrompt(data.value);
      } else {
        setPrompt(DEFAULT_SYSTEM_PROMPT);
      }
    } catch (err) {
      console.error("Error loading system prompt settings:", err);
      setPrompt(DEFAULT_SYSTEM_PROMPT);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setSaving(true);
    setSuccessMsg("");

    try {
      const { error } = await supabase.from("settings").upsert(
        {
          key: "chatbot_system_prompt",
          value: prompt.trim(),
        },
        { onConflict: "key" }
      );

      if (error) throw error;

      setSuccessMsg("System prompt saved successfully! The chatbot will use the new instructions immediately.");
      setTimeout(() => setSuccessMsg(""), 5000);
    } catch (err: any) {
      console.error("Error saving chatbot prompt:", err);
      alert(err.message || "Failed to save system prompt. Please ensure settings table has been created.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      <div>
        <span className="font-black text-[12px] uppercase tracking-widest text-primary">Intelligence</span>
        <h1 className="font-black text-[2.5rem] md:text-[3.2rem] leading-none tracking-[-0.05em] mt-3 mb-0">
          Chatbot Configuration
        </h1>
        <p className="text-foreground/50 font-bold text-sm mt-2 mb-0">
          Edit the instructions and constraints that guide the AI assistant&#39;s behavior.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/20 border-t-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-16">
          <form onSubmit={handleSave} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-[11px] font-black uppercase tracking-widest text-foreground/40">
                System Instructions & System Prompt
              </label>
              <textarea
                required
                rows={15}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write instructions for the chatbot..."
                className="bg-transparent border border-border rounded-2xl focus:border-foreground outline-none font-bold text-sm leading-relaxed transition-colors resize-none p-5"
              />
            </div>

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={saving || !prompt.trim()}
                className="inline-flex h-14 items-center justify-center px-8 rounded-full bg-primary text-background font-black hover:opacity-90 active:scale-95 transition-all shadow-lg disabled:opacity-50 self-start cursor-pointer"
              >
                Save Configuration <Save size={16} className="ml-2" />
              </button>
              
              {successMsg && (
                <p className="text-sm font-bold text-green-600 px-4 mt-2">
                  {successMsg}
                </p>
              )}
            </div>
          </form>

          {/* Guidelines info card */}
          <div className="card-layered p-10 flex flex-col gap-6 justify-start self-start shadow-xs">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full border border-primary/20 flex items-center justify-center text-primary bg-muted">
                <Bot size={18} />
              </div>
              <span className="font-black text-lg tracking-tight uppercase">Config Tips</span>
            </div>
            
            <div className="flex flex-col gap-4 text-xs font-bold leading-relaxed text-foreground/60">
              <p className="m-0">
                The chatbot uses the <span className="text-primary font-black">Gemini 1.5 Flash</span> model. Changes to the system prompt take effect immediately on next visitor questions.
              </p>
              <p className="m-0 border-t border-border/40 pt-4">
                <span className="text-foreground block mb-1">PROMPT GUIDELINES:</span>
                • Instruct the model to represent EMPC professionally.<br />
                • Tell it not to make up prices, dates, or custom product availability.<br />
                • Advise it to prompt users to contact EMPC directly via the contact form or WhatsApp for highly specific inquiries.<br />
                • Specify that it should reply in the visitor&#39;s language.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
