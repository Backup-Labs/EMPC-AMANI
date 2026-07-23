import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    let systemPrompt = DEFAULT_SYSTEM_PROMPT;
    try {
      const supabase = await createClient();
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

    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const firstUserIndex = messages.findIndex((m: { role: string }) => m.role === "user");
    const historyMessages = firstUserIndex !== -1 ? messages.slice(firstUserIndex, -1) : [];

    const chat = model.startChat({
      history: historyMessages.map((m: { role: string; content: string }) => ({
        role: m.role === "user" ? "user" : "model",
        parts: [{ text: m.content }],
      })),
      systemInstruction: {
        role: "system",
        parts: [{ text: systemPrompt }],
      },
    });

    const lastMessage = messages.at(-1);
    const result = await chat.sendMessage(lastMessage.content);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (err: unknown) {
    console.error("AI Chatbot Route Error:", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
