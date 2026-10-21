import type { Metadata } from "next";
import { NoteForm } from "@/components/NoteForm/NoteForm";
import styles from "./CreateNote.module.css";

const title = "Create note | NoteHub";
const description = "Create a new note and save your ideas in NoteHub.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "https://notehub.com/notes/action/create",
    images: [
      {
        url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
        width: 1200,
        height: 630,
        alt: "NoteHub notes application",
      },
    ],
  },
};

export default function CreateNote() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
