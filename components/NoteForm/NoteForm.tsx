"use client";

import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { createNote } from "@/lib/api";
import { useNoteStore } from "@/lib/store/noteStore";
import type { NotePayload } from "@/types/note";
import styles from "./NoteForm.module.css";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"] as const;

export function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const draft = useNoteStore((state) => state.draft);
  const setDraft = useNoteStore((state) => state.setDraft);
  const clearDraft = useNoteStore((state) => state.clearDraft);
  const [hydrated, setHydrated] = useState(false);
  const mutation = useMutation({ mutationFn: createNote });

  useEffect(() => {
    let active = true;

    const hydrateDraft = async () => {
      try {
        await useNoteStore.persist.rehydrate();
      } catch {
        toast.error("Unable to restore your saved draft");
      } finally {
        if (active) setHydrated(true);
      }
    };

    void hydrateDraft();
    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (formData: FormData) => {
    const titleValue = formData.get("title");
    const contentValue = formData.get("content");
    const tagValue = formData.get("tag");
    const title = typeof titleValue === "string" ? titleValue.trim() : "";
    const content = typeof contentValue === "string" ? contentValue.trim() : "";
    const tag = typeof tagValue === "string" ? tagValue : "";

    if (title.length < 3 || title.length > 50) {
      toast.error("Title must be between 3 and 50 characters");
      return;
    }
    if (content.length > 500) {
      toast.error("Content must be at most 500 characters");
      return;
    }
    if (!tags.some((validTag) => validTag === tag)) {
      toast.error("Select a valid tag");
      return;
    }

    const payload: NotePayload = { title, content: content || undefined, tag };

    try {
      await mutation.mutateAsync(payload);
    } catch {
      toast.error("Unable to save note. Please try again.");
      return;
    }

    clearDraft();
    await queryClient.invalidateQueries({ queryKey: ["notes"] });
    toast.success("Note created");
    router.push("/notes/filter/all");
  };

  if (!hydrated) return null;

  return (
    <form className={styles.form} action={handleSubmit}>
      <label>
        <span>Title</span>
        <input
          name="title"
          defaultValue={draft.title}
          onChange={(event) => setDraft({ title: event.target.value })}
          placeholder="Note title"
          minLength={3}
          maxLength={50}
          required
        />
      </label>
      <label>
        <span>Content</span>
        <textarea
          name="content"
          defaultValue={draft.content}
          onChange={(event) => setDraft({ content: event.target.value })}
          placeholder="Write your note..."
          rows={8}
          maxLength={500}
        />
      </label>
      <label>
        <span>Tag</span>
        <select
          name="tag"
          defaultValue={draft.tag}
          onChange={(event) => setDraft({ tag: event.target.value })}
          required
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </label>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.secondaryButton}
          onClick={() => router.back()}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={styles.primaryButton}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Saving..." : "Create note"}
        </button>
      </div>
    </form>
  );
}
