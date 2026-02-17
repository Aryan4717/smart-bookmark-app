import { createServerSupabaseClient } from "@/lib/supabase/server";
import { AuthButtons } from "@/components/auth/AuthButtons";

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAuthenticated = !!user;

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
          Welcome to
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-4xl">
          Smart Bookmark App
        </h1>
        <p className="max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
          Organize, search, and revisit the links that matter most. This is your
          central hub for a faster, calmer web.
        </p>
      </header>

      <section className="space-y-4">
        <AuthButtons userEmail={user?.email ?? null} />
      </section>

      <section className="grid gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 sm:grid-cols-2">
        <div>
          <p className="font-medium text-zinc-800 dark:text-zinc-100">
            What&apos;s next?
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Design bookmark collections and tags</li>
            <li>Add search and filters</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-zinc-800 dark:text-zinc-100">
            Tech stack
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Next.js App Router (TypeScript)</li>
            <li>Supabase Auth (Google OAuth only)</li>
            <li>Tailwind CSS v4</li>
          </ul>
        </div>
      </section>

      <section className="mt-4 space-y-3 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950/40">
        <p className="font-medium text-zinc-900 dark:text-zinc-50">
          Bookmark workspace
        </p>
        {isAuthenticated ? (
          <div className="space-y-2 text-zinc-700 dark:text-zinc-200">
            <p>
              This is your protected bookmark area. Only authenticated users can
              see this section.
            </p>
            <p className="text-[0.7rem] text-zinc-500 dark:text-zinc-400">
              Next steps: hook this up to a Supabase database table and render
              the user&apos;s saved bookmarks.
            </p>
          </div>
        ) : (
          <p className="text-zinc-500 dark:text-zinc-400">
            Sign in with Google to unlock your bookmark workspace.
          </p>
        )}
      </section>
    </main>
  );
}
