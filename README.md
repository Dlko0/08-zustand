# NoteHub Zustand

NoteHub is a notes application built with the Next.js App Router, TypeScript, CSS Modules, Axios, TanStack Query, and Zustand. Notes are filtered by tag at `/notes/filter/{tag}`, note details open in an intercepted modal route, and unfinished note drafts persist in local storage.

## Local development

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_NOTEHUB_TOKEN` to your NoteHub API token.
3. Run `npm run dev` and open `http://localhost:3000`.

Run `npm run build` to create a production build and `npm start` to serve it locally.

## Vercel

Import the `08-zustand` repository into Vercel. Add `NEXT_PUBLIC_NOTEHUB_TOKEN` to the project's environment variables for the Production, Preview, and Development environments, then deploy. Verify the notes filters, search, note creation, saved drafts, and intercepted note detail modal on the production URL.
