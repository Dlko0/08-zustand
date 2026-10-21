import type { ReactNode } from "react";
import styles from "./layout.module.css";

export default function NotesFilterLayout({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar: ReactNode;
}) {
  return (
    <section className={styles.container}>
      <aside className={styles.sidebar}>{sidebar}</aside>
      <div className={styles.notesWrapper}>{children}</div>
    </section>
  );
}
