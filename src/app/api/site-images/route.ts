import { NextResponse, type NextRequest } from "next/server";
import { testimonials, doctors, blogPosts } from "@/data/content";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

const BUCKET = "site-images";
const MAX_BYTES = 5 * 1024 * 1024;

function allowedSlots(): Set<string> {
  return new Set([
    ...testimonials.map((t) => t.id),
    ...doctors.map((d) => d.id),
    ...blogPosts.map((p) => `blog-${p.slug}`),
  ]);
}

function extensionFor(file: File): string {
  const nameExt = file.name.split(".").pop();
  if (nameExt && /^[a-z0-9]{2,5}$/i.test(nameExt)) return nameExt.toLowerCase();
  const mime: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return mime[file.type] ?? "jpg";
}

export async function GET() {
  const admin = supabaseAdmin();
  try {
    if (admin) {
      const { data, error } = await admin.from("site_images").select("slot,url");
      if (error) {
        logger.warn("api/site-images", "select failed", error);
        return NextResponse.json({ overrides: {} });
      }
      return NextResponse.json({
        overrides: Object.fromEntries((data ?? []).map((r) => [r.slot, r.url])),
      });
    }
    const client = await createClient();
    const { data, error } = await client.from("site_images").select("slot,url");
    if (error) {
      logger.warn("api/site-images", "select failed (anon)", error);
      return NextResponse.json({ overrides: {} });
    }
    return NextResponse.json({
      overrides: Object.fromEntries((data ?? []).map((r) => [r.slot, r.url])),
    });
  } catch (err) {
    logger.warn("api/site-images", "get failed", err);
    return NextResponse.json({ overrides: {} });
  }
}

export async function POST(req: NextRequest) {
  const admin = supabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      { error: "missing_config" },
      { status: 503 }
    );
  }

  const form = await req.formData();
  const slot = String(form.get("slot") ?? "");
  const file = form.get("file");

  if (!allowedSlots().has(slot)) {
    return NextResponse.json({ error: "invalid_slot" }, { status: 400 });
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "not_image" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 400 });
  }

  const path = `${slot}.${extensionFor(file)}`;

  try {
    const { data: existing } = await admin
      .from("site_images")
      .select("path")
      .eq("slot", slot)
      .maybeSingle();

    const { error: uploadError } = await admin.storage
      .from(BUCKET)
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) {
      logger.warn("api/site-images", "upload failed", uploadError);
      return NextResponse.json({ error: "upload_failed" }, { status: 500 });
    }

    const { data: publicUrl } = admin.storage.from(BUCKET).getPublicUrl(path);
    const url = publicUrl.publicUrl;

    const { error: dbError } = await admin.from("site_images").upsert(
      { slot, url, path, updated_at: new Date().toISOString() },
      { onConflict: "slot" }
    );

    if (dbError) {
      logger.warn("api/site-images", "upsert failed", dbError);
      await admin.storage.from(BUCKET).remove([path]);
      return NextResponse.json({ error: "save_failed" }, { status: 500 });
    }

    if (existing?.path && existing.path !== path) {
      await admin.storage.from(BUCKET).remove([existing.path]);
    }

    return NextResponse.json({ url });
  } catch (err) {
    logger.warn("api/site-images", "post failed", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = supabaseAdmin();
  if (!admin) {
    return NextResponse.json({ error: "missing_config" }, { status: 503 });
  }

  const { slot } = (await req.json().catch(() => ({}))) as { slot?: string };
  if (!slot || !allowedSlots().has(slot)) {
    return NextResponse.json({ error: "invalid_slot" }, { status: 400 });
  }

  try {
    const { data } = await admin
      .from("site_images")
      .select("path")
      .eq("slot", slot)
      .maybeSingle();

    if (data?.path) {
      await admin.storage.from(BUCKET).remove([data.path]);
    }

    await admin.from("site_images").delete().eq("slot", slot);
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.warn("api/site-images", "delete failed", err);
    return NextResponse.json({ error: "internal" }, { status: 500 });
  }
}
