import axios from "axios";
import type { Note, NotePayload } from "@/types/note";
import type { NotesPage, NotesResponse } from "@/types/notesPage";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication failed. Check NEXT_PUBLIC_NOTEHUB_TOKEN.");
    }
    return Promise.reject(error);
  },
);

const toNumber = (value: unknown, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

function normalizeNotesPage(
  response: NotesResponse,
  page: number,
  perPage: number,
): NotesPage {
  const notes = (response.notes ??
    response.data ??
    response.items ??
    response.results ??
    []) as Note[];
  const total = toNumber(response.total ?? response.count, notes.length);
  const totalPages = toNumber(response.totalPages ?? response.pages, 1);

  return {
    notes,
    total,
    page: toNumber(response.page ?? response.currentPage, page),
    perPage: toNumber(response.perPage ?? response.limit, perPage),
    totalPages: totalPages || Math.ceil(total / perPage),
  };
}

function normalizeNote(value: unknown): Note {
  if (!value || typeof value !== "object")
    throw new Error("Invalid note response");
  const note = value as Record<string, unknown>;
  const id = note.id ?? note.noteId;
  const title = note.title ?? note.name;
  const content = note.content ?? note.body ?? "";
  const tag = note.tag ?? note.tags ?? "";
  const createdAt = note.createdAt ?? note.created_at ?? note.created;
  const updatedAt =
    note.updatedAt ?? note.updated_at ?? note.updated ?? createdAt;

  if (
    id === undefined ||
    id === null ||
    typeof title !== "string" ||
    typeof content !== "string" ||
    createdAt === undefined
  ) {
    throw new Error("Invalid note response");
  }

  return {
    id: String(id),
    title,
    content,
    tag: typeof tag === "string" ? tag : "",
    createdAt: String(createdAt),
    updatedAt: String(updatedAt ?? createdAt),
  };
}

export async function fetchNotes(
  page: number,
  perPage: number,
  search = "",
  tag = "",
): Promise<NotesPage> {
  const response = await api.get<NotesResponse>("/notes", {
    params: {
      page,
      perPage,
      search: search.trim() || undefined,
      tag: tag.trim() && tag.toLowerCase() !== "all" ? tag.trim() : undefined,
    },
  });
  return normalizeNotesPage(response.data, page, perPage);
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await api.get<Note>(`/notes/${encodeURIComponent(id)}`);
  return normalizeNote(response.data);
}

export async function createNote(payload: NotePayload): Promise<Note> {
  const response = await api.post<Note>("/notes", payload);
  return normalizeNote(response.data);
}

export async function updateNote(
  id: string,
  payload: NotePayload,
): Promise<Note> {
  const response = await api.patch<Note>(
    `/notes/${encodeURIComponent(id)}`,
    payload,
  );
  return normalizeNote(response.data);
}

export async function deleteNote(id: string): Promise<Note> {
  const response = await api.delete<Note>(`/notes/${encodeURIComponent(id)}`);
  return normalizeNote(response.data);
}
