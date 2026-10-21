import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNoteById } from "@/lib/api";
import { NoteDetailsClient } from "./NoteDetails.client";

const OG_IMAGE = {
  url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
  width: 1200,
  height: 630,
  alt: "NoteHub notes application",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const note = await fetchNoteById(id);
  const title = `${note.title} | NoteHub`;
  const description =
    note.content.trim().slice(0, 160) ||
    `View the note "${note.title}" in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/${encodeURIComponent(id)}`,
      images: [OG_IMAGE],
    },
  };
}

export default async function NoteDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
