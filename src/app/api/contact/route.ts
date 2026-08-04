import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(2).max(160),
  message: z.string().min(10).max(4000),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    logger.info("api/contact", "incoming message", parsed.data.email);

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { error } = await supabase
          .from("contact_messages")
          .insert(parsed.data);
        if (error) {
          logger.warn("api/contact", "supabase insert failed", error);
        }
      } catch (error) {
        logger.warn("api/contact", "supabase unavailable", error);
      }
    } else {
      logger.info("api/contact", "demo mode — message not persisted");
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    logger.error("api/contact", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
