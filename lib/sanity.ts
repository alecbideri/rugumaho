import { createClient } from '@sanity/client';

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-07-03', // Use current date for api versioning
  useCdn: false, // Set to false to ensure we always get fresh edits, or true for cache
});

// Private client configured with write token.
// NEVER import this in purely client-side React files.
// Use this client inside Server Actions, API routes, or server-side functions.
export const sanityWriteClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-07-03',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});
