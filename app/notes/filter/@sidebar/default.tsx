import Link from "next/link";
import styles from "./SidebarNotes.module.css";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  return (
    <nav aria-label="Filter notes by tag">
      <ul className={styles.menuList}>
        <li className={styles.menuItem}>
          <Link href="/notes/filter/all" className={styles.menuLink}>
            All notes
          </Link>
        </li>
        {tags.map((tag) => (
          <li className={styles.menuItem} key={tag}>
            <Link
              href={`/notes/filter/${encodeURIComponent(tag)}`}
              className={styles.menuLink}
            >
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
