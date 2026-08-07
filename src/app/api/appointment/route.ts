import { NextResponse } from "next/server";
import { z } from "zod";
import { logger } from "@/lib/logger";

const appointmentSchema = z.object({
  firstName: z.string().min(2).max(80),
  lastName: z.string().min(2).max(80),
  phone: z.string().min(8).max(30),
  email: z.string().email().optional().default(""),
  message: z.string().max(2000).optional().default(""),
  service: z.string().max(120).optional().default(""),
  serviceName: z.string().optional().default(""),
  doctor: z.string().min(1).max(120),
  doctorName: z.string().optional().default(""),
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
        const notes = [
          data.serviceName ? `الخدمة: ${data.serviceName}` : "",
          data.doctorName ? `الطبيب: ${data.doctorName}` : "",
          data.time ? `الوقت: ${data.time}` : "",
          data.message,
        ]
          .filter(Boolean)
          .join("\n");
        const { error } = await supabase.from("appointments").insert({
          patient: `${data.firstName} ${data.lastName}`,
          phone: data.phone,
          date: data.date,
          status: "pending",
          notes,
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
