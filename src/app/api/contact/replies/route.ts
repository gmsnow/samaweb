import { NextResponse, type NextRequest } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const phone = (request.nextUrl.searchParams.get("phone") ?? "")
    .trim()
    .slice(0, 30);
  if (!phone) {
    return NextResponse.json({ replies: [] });
  }

  const admin = supabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "missing_config" }, { status: 503 });
  }

  try {
    const { data, error } = await admin
      .from("contact_messages")
      .select("id, name, subject, message, reply, replied_at, created_at")
      .eq("phone", phone)
      .not("reply", "is", null)
      .order("created_at", { ascending: false });

    if (error) {
      logger.warn("api/contact/replies", "select failed", error);
      return NextResponse.json({ replies: [] });
    }

    return NextResponse.json({ replies: data ?? [] });
  } catch (err) {
    logger.warn("api/contact/replies", "fetch failed", err);
    return NextResponse.json({ replies: [] });
  }
}
