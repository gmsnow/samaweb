import { NextResponse } from "next/server";
import { z } from "zod";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

const ratingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(2000).optional().default(""),
  page: z.string().max(200).optional().default(""),
});

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ratingSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", issues: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { rating, comment, page } = parsed.data;
    logger.info("api/rating", "rating submitted", `${rating} stars`);

    const row = {
      rating,
      comment: comment || null,
      page: page || null,
    };

    const admin = supabaseAdmin();
    if (admin) {
      const { error } = await admin.from("site_reviews").insert(row);
      if (error) {
        logger.warn("api/rating", "supabase insert failed (admin)", error);
        return NextResponse.json({ error: "save_failed" }, { status: 500 });
      }
    } else {
      try {
        const supabase = await createClient();
        const { error } = await supabase.from("site_reviews").insert(row);
        if (error) {
          logger.warn("api/rating", "supabase insert failed (anon)", error);
          return NextResponse.json({ error: "save_failed" }, { status: 500 });
        }
      } catch (error) {
        logger.warn("api/rating", "supabase unavailable", error);
        return NextResponse.json({ error: "save_failed" }, { status: 500 });
      }
    }

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    logger.error("api/rating", error);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
