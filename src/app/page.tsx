export default function Home() {
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
        <button
          type="button"
          className="inline-flex w-full items-center justify-center rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 focus-visible:ring-offset-background dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200 sm:w-auto"
        >
          Login to continue
        </button>
        <p className="text-xs text-zinc-500">
          Authentication is not wired up yet. This button is a placeholder for a
          future login flow.
        </p>
      </section>

      <section className="grid gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50/80 p-4 text-xs text-zinc-600 dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-zinc-400 sm:grid-cols-2">
        <div>
          <p className="font-medium text-zinc-800 dark:text-zinc-100">
            What&apos;s next?
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Add authentication (e.g. OAuth or email link)</li>
            <li>Design bookmark collections and tags</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-zinc-800 dark:text-zinc-100">
            Tech stack
          </p>
          <ul className="mt-1 list-disc space-y-1 pl-4">
            <li>Next.js App Router (TypeScript)</li>
            <li>Tailwind CSS v4</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
