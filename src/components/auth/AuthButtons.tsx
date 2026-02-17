"use client";

import { useCallback, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type AuthButtonsProps = {
  userEmail?: string | null;
};

export function AuthButtons({ userEmail }: AuthButtonsProps) {
  const [loading, setLoading] = useState<"login" | "logout" | null>(null);

  const handleLogin = useCallback(async () => {
    try {
      setLoading("login");
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
    } finally {
      setLoading(null);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      setLoading("logout");
      const supabase = createBrowserSupabaseClient();
      await supabase.auth.signOut();
      window.location.replace("/");
    } finally {
      setLoading(null);
    }
  }, []);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
        {userEmail ? (
          <>
            <p className="font-medium text-zinc-900 dark:text-zinc-50">
              Signed in as
            </p>
            <p>{userEmail}</p>
          </>
        ) : (
          <p className="text-zinc-600 dark:text-zinc-400">
            Sign in with your Google account to access your bookmarks.
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {!userEmail && (
          <button
            type="button"
            onClick={handleLogin}
            disabled={loading === "login"}
            className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            {loading === "login" ? "Redirecting..." : "Continue with Google"}
          </button>
        )}

        {userEmail && (
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading === "logout"}
            className="inline-flex items-center justify-center rounded-xl border border-zinc-300 px-3 py-2 text-xs font-medium text-zinc-700 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-900"
          >
            {loading === "logout" ? "Signing out..." : "Logout"}
          </button>
        )}
      </div>
    </div>
  );
}


