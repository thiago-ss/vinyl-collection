import { z } from "zod";

export const TrackSchema = z.object({
  name: z.string(),
  duration: z.number(),
});

export const VinylSchema = z.object({
  title: z.string(),
  artist: z.string(),
  totalTracks: z.number(),
  tracks: z.array(TrackSchema),
  releaseDate: z.string(),
  coverImage: z.string().url(),
});

export const SpotifyAlbumSchema = z.object({
  id: z.string(),
  name: z.string(),
  artist: z.string(),
  imageUrl: z.string(),
  releaseDate: z.string().optional(),
  totalTracks: z.number().optional(),
  tracks: z.array(TrackSchema).optional(),
});

export type Track = z.infer<typeof TrackSchema>;
export type Vinyl = z.infer<typeof VinylSchema>;
export type SpotifyAlbum = z.infer<typeof SpotifyAlbumSchema>;
