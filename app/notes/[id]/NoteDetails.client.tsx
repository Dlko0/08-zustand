"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { fetchNoteById } from "@/lib/api";
import styles from "./NoteDetails.module.css";

export function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>();
  const {
    data: note,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  if (isLoading)
    return <p className={styles.status}>Loading, please wait...</p>;
  if (isError || !note)
    return <p className={styles.status}>Something went wrong.</p>;

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <article className={styles.item}>
          <div className={styles.header}>
            <h2>{note.title}</h2>
          </div>
          <p className={styles.tag}>{note.tag}</p>
          <p className={styles.content}>{note.content}</p>
          <p className={styles.date}>
            Created{" "}
            {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
              new Date(note.createdAt),
            )}
          </p>
        </article>
      </div>
    </main>
  );
}
