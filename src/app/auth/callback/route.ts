import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const supabase = await createServerSupabaseClient();

  await supabase.auth.exchangeCodeForSession(code);

  // After exchanging the code for a session, redirect to the homepage
  return NextResponse.redirect(new URL("/", request.url));
}


