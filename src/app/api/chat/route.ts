import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(30),
});

const SYSTEM_PROMPT = `You are "Sama Assistant", the helpful AI assistant for Sama Center, a premium physical therapy and rehabilitation clinic.
Answer concisely and warmly. Help with: booking appointments, services (physical therapy, sports rehab, neuro rehab, orthopedic rehab, pediatric therapy, manual therapy, hydrotherapy, pain management, home visits), recovery timelines, insurance questions, pricing, opening hours and general rehab advice.
If the user wants to book, suggest they visit the Book Appointment page or call. Keep answers under 120 words. If unsure, recommend contacting the clinic.`;

const FALLBACK_REPLY =
  "Thanks for reaching out to Sama Center! I'm here to help with bookings, services, recovery plans and more. (Live AI is not configured yet — contact us at +966 11 234 5678 or use the Book Appointment page and our team will follow up within minutes.)";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const apiUrl = process.env.AI_API_URL;
    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    if (!apiUrl || !apiKey) {
      logger.info("api/chat", "no AI config — returning fallback reply");
      return NextResponse.json({ reply: FALLBACK_REPLY }, { status: 200 });
    }

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...parsed.data.messages,
    ];

    const res = await fetch(`${apiUrl.replace(/\/$/, "")}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 300,
        temperature: 0.7,
      }),
      signal: AbortSignal.timeout(20000),
    });

    if (!res.ok) {
      logger.warn("api/chat", `LLM returned ${res.status}`);
      return NextResponse.json({ reply: FALLBACK_REPLY }, { status: 200 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? FALLBACK_REPLY;
    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    logger.error("api/chat", error);
    return NextResponse.json({ reply: FALLBACK_REPLY }, { status: 200 });
  }
}
