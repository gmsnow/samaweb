import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const appointmentSchema = z.object({
  firstName: z.string().min(2).max(80),
  lastName: z.string().min(2).max(80),
  phone: z.string().min(8).max(30),
  email: z.string().email().optional().default(""),
  message: z.string().max(2000).optional().default(""),
  service: z.string().min(1).max(120),
  doctor: z.string().min(1).max(120),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = appointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;
    logger.info("api/appointment", "booking requested", `${data.service} @ ${data.date} ${data.time}`);

    if (
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      try {
        const { createClient } = await import("@/lib/supabase/server");
        const supabase = await createClient();
        const { error } = await supabase.from("appointments").insert({
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone,
          email: data.email,
          notes: data.message,
          service_id: data.service,
          doctor_id: data.doctor,
          scheduled_at: `${data.date}T${data.time}:00`,
        });
        if (error) {
          logger.warn("api/appointment", "supabase insert failed", error);
        }
      } catch (error) {
        logger.warn("api/appointment", "supabase unavailable", error);
      }
    } else {
      logger.info("api/appointment", "demo mode — booking not persisted");
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    logger.error("api/appointment", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
