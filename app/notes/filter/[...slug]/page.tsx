import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import type { Metadata } from "next";
import { fetchNotes } from "@/lib/api";
import { NotesClient } from "./Notes.client";

const PER_PAGE = 9;

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tag = slug[0] || "all";
  const title =
    tag.toLowerCase() === "all"
      ? "All notes | NoteHub"
      : `${tag} notes | NoteHub`;
  const description =
    tag.toLowerCase() === "all"
      ? "Browse and manage all your notes in NoteHub."
      : `Browse and manage your ${tag} notes in NoteHub.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://notehub.com/notes/filter/${encodeURIComponent(tag)}`,
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
}

export default async function NotesPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const tag = slug[0] || "all";
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["notes", 1, PER_PAGE, "", tag === "all" ? "" : tag],
    queryFn: () => fetchNotes(1, PER_PAGE, "", tag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient tag={tag} />
    </HydrationBoundary>
  );
}
