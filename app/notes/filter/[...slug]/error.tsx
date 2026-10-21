"use client";

export default function NotesError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <p>Could not fetch the list of notes. {error.message}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
