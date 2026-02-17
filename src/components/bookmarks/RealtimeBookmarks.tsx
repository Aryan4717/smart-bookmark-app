"use client";

import { useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";

type Bookmark = {
  id: string;
  title: string;
  url: string;
  created_at: string;
};

type RealtimeBookmarksProps = {
  initialBookmarks: Bookmark[];
  userId: string;
};

export function RealtimeBookmarks({
  initialBookmarks,
  userId,
}: RealtimeBookmarksProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const channel = supabase
      .channel(`bookmarks-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((current) => {
            const exists = current.some((b) => b.id === newBookmark.id);
            if (exists) return current;
            return [newBookmark, ...current];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const removed = payload.old as Bookmark;
          setBookmarks((current) =>
            current.filter((b) => b.id !== removed.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  if (bookmarks.length === 0) {
    return (
      <p className="text-zinc-500 dark:text-zinc-400">
        No bookmarks yet. Add your first one above.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {bookmarks.map((bookmark) => (
        <li
          key={bookmark.id}
          className="flex flex-col gap-1 rounded-lg border border-zinc-200 bg-white/80 p-3 text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-900/60"
        >
          <p className="text-xs font-medium text-zinc-900 dark:text-zinc-50">
            {bookmark.title}
          </p>
          <a
            href={bookmark.url}
            target="_blank"
            rel="noopener noreferrer"
            className="truncate text-[0.7rem] text-zinc-500 underline-offset-2 hover:underline dark:text-zinc-400"
          >
            {bookmark.url}
          </a>
          <p className="text-[0.65rem] text-zinc-400">
            {formatDate(bookmark.created_at)}
          </p>
        </li>
      ))}
    </ul>
  );
}


