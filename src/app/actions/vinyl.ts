"use server";

import { db } from "@/db/index";
import { vinyls } from "@/db/schema";
import { action } from "@/lib/safe-action";
import { VinylSchema } from "@/types/vinyl";
import { eq } from "drizzle-orm";
import { z } from "zod";

export interface AlbumData {
  id: string;
  name: string;
  artist: string;
  imageUrl: string;
  releaseDate: string;
  totalTracks: number;
  tracks: Array<{ id: string; name: string; duration: number }>;
}

export async function getVinyls() {
  return db.select().from(vinyls);
}

export async function getVinylById(id: number) {
  const result = await db.select().from(vinyls).where(eq(vinyls.id, id));
  return result[0];
}

export const addVinyl = action
  .schema(VinylSchema)
  .action(async ({ parsedInput: input }) => {
    const result = await db
      .insert(vinyls)
      .values({
        title: input.title,
        artist: input.artist,
        totalTracks: input.totalTracks,
        tracks: input.tracks.map((track, index) => ({
          id: `track-${index + 1}`,
          name: track.name,
          duration: track.duration,
        })),
        releaseDate: input.releaseDate,
        coverImage: input.coverImage,
      })
      .returning();

    return { success: true, vinyl: result[0] };
  });

const deleteSchema = z.object({
  id: z.number(),
});

export const deleteVinyl = action
  .schema(deleteSchema)
  .action(async ({ parsedInput: { id } }) => {
    await db.delete(vinyls).where(eq(vinyls.id, id));
    return { success: true, deletedId: id };
  });
