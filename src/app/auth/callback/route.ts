import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * OAuth / magic-link callback.
 * Supabase redirects here with ?code=... which we exchange for a session.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/portal/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const safeNext = next.startsWith("/") ? next : "/portal/dashboard";
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
    console.error("exchangeCodeForSession:", error.message);
  }

  return NextResponse.redirect(`${origin}/portal/login?error=auth`);
}
