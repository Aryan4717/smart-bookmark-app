import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Cookie set/remove operations are only allowed in Server Actions and Route Handlers
        // For server components, we only provide read access to cookies
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
            });
          } catch (error) {
            // Silently fail in server components - cookie operations should be done in Server Actions
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({
              name,
              value: "",
              ...options,
              maxAge: 0,
            });
          } catch (error) {
            // Silently fail in server components - cookie operations should be done in Server Actions
          }
        },
      },
    }
  );
}


