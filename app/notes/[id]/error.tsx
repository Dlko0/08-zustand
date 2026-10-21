"use client";

export default function NoteDetailsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <p>Could not fetch note details. {error.message}</p>
      <button type="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
