import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const chatSchema = z.object({
  messages: z
    .array(z.object({ role: z.enum(["system", "user", "assistant"]), content: z.string().max(4000) }))
    .min(1)
    .max(30),
  locale: z.enum(["ar", "en"]).default("en"),
});

const SYSTEM_PROMPT_EN = `You are "Sama Assistant", the helpful AI assistant for Sama Center, a premium physical therapy and rehabilitation clinic.
Answer concisely and warmly. Help with: booking appointments, services (physical therapy, sports rehab, neuro rehab, orthopedic rehab, pediatric therapy, manual therapy, hydrotherapy, pain management, home visits), recovery timelines, insurance questions, pricing, opening hours and general rehab advice.
If the user wants to book, suggest they visit the Book Appointment page or call. Keep answers under 120 words. If unsure, recommend contacting the clinic.`;

const SYSTEM_PROMPT_AR = `أنت "مساعد سما"، المساعد الذكي لمركز سما، مركز متخصص في العلاج الطبيعي وإعادة التأهيل.
أجب بإيجاز وبأسلوب ودود، وباللغة العربية الفصحى. ساعد في: حجز المواعيد، الخدمات (العلاج الطبيعي، تأهيل الإصابات الرياضية، التأهيل العصبي، تأهيل العظام والمفاصل، العلاج الطبيعي للأطفال، العلاج اليدوي، العلاج المائي، علاج الألم، الزيارات المنزلية)، جداول التعافي، أسئلة التأمين، الأسعار، ساعات العمل، ونصائح عامة لإعادة التأهيل.
إذا أراد المستخدم الحجز، انصحه بزيارة صفحة حجز موعد أو الاتصال بالمركز. حافظ على الإجابة في أقل من 120 كلمة. إذا لم تكن متأكداً، انصح بالتواصل مع المركز.`;

const FALLBACK_REPLY_EN =
  "Thanks for reaching out to Sama Center! I'm here to help with bookings, services, recovery plans and more. (Live AI is not configured yet — contact us at +966 11 234 5678 or use the Book Appointment page and our team will follow up within minutes.)";

const FALLBACK_REPLY_AR =
  "شكراً لتواصلك مع مركز سما! أنا هنا لمساعدتك في الحجوزات والخدمات وخطط التعافي والمزيد. (لم يتم إعداد الذكاء الاصطناعي بعد — تواصل معنا على +966 11 234 5678 أو استخدم صفحة حجز موعد وسيتواصل معك فريقنا خلال دقائق.)";

export async function POST(request: Request) {
  let isArabic = false;
  try {
    const body = await request.json();
    const parsed = chatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    isArabic = parsed.data.locale === "ar";
    const fallbackReply = isArabic ? FALLBACK_REPLY_AR : FALLBACK_REPLY_EN;
    const systemPrompt = isArabic ? SYSTEM_PROMPT_AR : SYSTEM_PROMPT_EN;

    const apiUrl = process.env.AI_API_URL;
    const apiKey = process.env.AI_API_KEY;
    const model = process.env.AI_MODEL ?? "gpt-4o-mini";

    if (!apiUrl || !apiKey) {
      logger.info("api/chat", "no AI config — returning fallback reply");
      return NextResponse.json({ reply: fallbackReply }, { status: 200 });
    }

    const messages = [
      { role: "system", content: systemPrompt },
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
      return NextResponse.json({ reply: fallbackReply }, { status: 200 });
    }

    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content ?? fallbackReply;
    return NextResponse.json({ reply }, { status: 200 });
  } catch (error) {
    logger.error("api/chat", error);
    return NextResponse.json({ reply: isArabic ? FALLBACK_REPLY_AR : FALLBACK_REPLY_EN }, { status: 200 });
  }
}
