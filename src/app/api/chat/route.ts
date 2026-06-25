import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

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

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Try to fetch custom system prompt from Supabase settings
    let systemPrompt = DEFAULT_SYSTEM_PROMPT;
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("value")
        .eq("key", "chatbot_system_prompt")
        .single();
      
      if (data && data.value && !error) {
        systemPrompt = data.value;
      }
    } catch (dbErr) {
      console.warn("Could not load system prompt from settings, falling back to default.", dbErr);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({
      history: messages.slice(0, -1).map((m: any) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      systemInstruction: systemPrompt,
    });

    const lastMessage = messages.at(-1);
    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err: any) {
    console.error("AI Chatbot Route Error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
