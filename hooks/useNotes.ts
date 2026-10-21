import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createNote, fetchNoteById, fetchNotes, updateNote } from "../lib/api";
import type { Note, NotePayload } from "../types/note";

const NOTES_KEY = ["notes"] as const;

export function useNotes(
  page: number,
  perPage: number,
  search: string,
  tag = "",
) {
  const normalizedTag = tag.toLowerCase() === "all" ? "" : tag;

  return useQuery({
    queryKey: [...NOTES_KEY, page, perPage, search, normalizedTag],
    queryFn: () => fetchNotes(page, perPage, search, normalizedTag),
    placeholderData: (previous) => previous,
    staleTime: 30_000,
  });
}

export function useNote(id: string) {
  return useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    enabled: Boolean(id),
  });
}

export function useCreateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNote,
    onSuccess: (note: Note) => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      return note;
    },
  });
}

export function useUpdateNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: NotePayload }) =>
      updateNote(id, payload),
    onSuccess: (_note: Note, variables) => {
      queryClient.invalidateQueries({ queryKey: NOTES_KEY });
      queryClient.invalidateQueries({ queryKey: ["note", variables.id] });
    },
  });
}
