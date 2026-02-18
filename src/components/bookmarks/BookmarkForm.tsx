"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";

type BookmarkFormProps = {
  action: (formData: FormData) => Promise<{ error: string | null } | void>;
};

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-xl bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 shadow-sm transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200"
    >
      {pending ? "Saving..." : "Add bookmark"}
    </button>
  );
}

export function BookmarkForm({ action }: BookmarkFormProps) {
  const [error, setError] = useState<string | null>(null);

  async function handleAction(formData: FormData) {
    setError(null);
    const result = (await action(formData)) as {
      error?: string | null;
      bookmark?: { id: string; title: string; url: string; created_at: string };
    } | void;
    if (result && result.error) {
      setError(result.error);
      return;
    }
    if (result && result.bookmark) {
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent("bookmark:created", {
            detail: result.bookmark,
          })
        );
      }
    }
  }

  return (
    <form
      action={handleAction}
      className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 text-xs dark:border-zinc-800 dark:bg-zinc-950/40"
    >
      <div className="space-y-1">
        <label
          htmlFor="title"
          className="block text-xs font-medium text-zinc-700 dark:text-zinc-200"
        >
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          placeholder="Eg. Next.js docs"
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </div>

      <div className="space-y-1">
        <label
          htmlFor="url"
          className="block text-xs font-medium text-zinc-700 dark:text-zinc-200"
        >
          URL
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://..."
          className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs text-zinc-900 shadow-sm outline-none transition focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <p className="text-[0.7rem] text-zinc-500 dark:text-zinc-400">
          Save links you want to revisit. Only you can see your bookmarks.
        </p>
        <SubmitButton />
      </div>

      {error && (
        <p className="text-[0.7rem] font-medium text-red-500">{error}</p>
      )}
    </form>
  );
}

