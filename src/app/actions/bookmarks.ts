"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function createBookmark(formData: FormData) {
  const title = formData.get("title")?.toString().trim();
  const url = formData.get("url")?.toString().trim();

  if (!title || !url) {
    return { error: "Title and URL are required." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to add bookmarks." };
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .insert({
      title,
      url,
      user_id: user.id,
    })
    .select("id, title, url, created_at, user_id")
    .single();

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return {
    error: null,
    bookmark: data
      ? {
          id: data.id,
          title: data.title,
          url: data.url,
          created_at: data.created_at,
        }
      : undefined,
  };
}

export async function deleteBookmark(bookmarkId: string) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to delete bookmarks." };
  }

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("id", bookmarkId)
    .eq("user_id", user.id); // RLS ensures only owner can delete

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  return { error: null };
}

