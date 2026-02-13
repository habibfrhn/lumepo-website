import { type NextRequest, NextResponse } from "next/server";

import { addContactToBrevo } from "@/lib/brevo";
import { isValidEmail, normalizeEmail } from "@/lib/email";
import { rateLimit } from "@/lib/rateLimit";
import { getSupabaseAdminClient } from "@/lib/supabase";
import { safeTrim, sha256Hex } from "@/lib/utils";

const MAX_BODY_BYTES = 2048;
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;

export const runtime = "nodejs";

export async function POST(request: NextRequest): Promise<NextResponse> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return NextResponse.json({ ok: false }, { status: 415 });
  }

  const rawBody = await request.text();
  const bodyByteLength = new TextEncoder().encode(rawBody).byteLength;
  if (bodyByteLength > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = rawBody ? (JSON.parse(rawBody) as unknown) : {};
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const data = typeof payload === "object" && payload !== null ? payload : {};

  const honeypot = safeTrim((data as Record<string, unknown>).hp, 256);
  if (honeypot) {
    return new NextResponse(null, { status: 204 });
  }

  const forwardedFor = request.headers.get("x-forwarded-for") ?? "unknown";
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown";

  const limit = rateLimit(ip, RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX);
  if (!limit.ok) {
    const response = NextResponse.json({ ok: false }, { status: 429 });
    if (limit.retryAfterSec) {
      response.headers.set("Retry-After", String(limit.retryAfterSec));
    }
    return response;
  }

  const emailInput = safeTrim((data as Record<string, unknown>).email, 320);
  const email = normalizeEmail(emailInput ?? "");

  if (!isValidEmail(email)) {
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  const source = safeTrim((data as Record<string, unknown>).source, 100);
  const landingPath = safeTrim((data as Record<string, unknown>).landingPath, 255);
  const utmInput = (data as Record<string, unknown>).utm;
  const utm = typeof utmInput === "object" && utmInput !== null ? utmInput : {};

  const utmSource = safeTrim((utm as Record<string, unknown>).source, 100);
  const utmMedium = safeTrim((utm as Record<string, unknown>).medium, 100);
  const utmCampaign = safeTrim((utm as Record<string, unknown>).campaign, 100);
  const utmContent = safeTrim((utm as Record<string, unknown>).content, 100);
  const utmTerm = safeTrim((utm as Record<string, unknown>).term, 100);

  const ipHash = await sha256Hex(ip);
  const userAgent = safeTrim(request.headers.get("user-agent"), 512);

  try {
    const supabase = getSupabaseAdminClient();
    await supabase.from("waitlist_signups").upsert(
      {
        email,
        marketing_consent: true,
        source,
        landing_path: landingPath,
        utm_source: utmSource,
        utm_medium: utmMedium,
        utm_campaign: utmCampaign,
        utm_content: utmContent,
        utm_term: utmTerm,
        ip_hash: ipHash,
        user_agent: userAgent,
      },
      { onConflict: "email_normalized" },
    );
  } catch {
    // Keep generic response behavior.
  }

  void addContactToBrevo(email, {
    SOURCE: source,
    LANDING_PATH: landingPath,
    UTM_SOURCE: utmSource,
    UTM_MEDIUM: utmMedium,
    UTM_CAMPAIGN: utmCampaign,
    UTM_CONTENT: utmContent,
    UTM_TERM: utmTerm,
  });

  return NextResponse.json({ ok: true }, { status: 200 });
}

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ ok: false }, { status: 405 });
}
