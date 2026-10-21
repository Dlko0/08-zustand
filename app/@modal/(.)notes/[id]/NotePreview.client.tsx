"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/Modal/Modal";
import { fetchNoteById } from "@/lib/api";
import styles from "./NotePreview.module.css";

export function NotePreviewClient({ id }: { id: string }) {
  const router = useRouter();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  return (
    <Modal
      open
      title={note?.title ?? "Note details"}
      onClose={() => router.back()}
    >
      {isLoading && <p className={styles.status}>Loading, please wait...</p>}
      {(isError || (!isLoading && !note)) && (
        <p className={styles.status}>Something went wrong.</p>
      )}
      {note && (
        <article className={styles.item}>
          <p className={styles.tag}>{note.tag}</p>
          <p className={styles.content}>{note.content}</p>
          <p className={styles.date}>
            Created{" "}
            {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
              new Date(note.createdAt),
            )}
          </p>
        </article>
      )}
    </Modal>
  );
}
