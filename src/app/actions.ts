"use server";

import { db } from "@/db/index";
import { vinyls, NewVinyl } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getVinyls() {
  return await db.select().from(vinyls);
}

export async function getVinylById(id: number) {
  const result = await db.select().from(vinyls).where(eq(vinyls.id, id));
  return result[0];
}

export async function addVinyl(vinyl: NewVinyl) {
  return await db.insert(vinyls).values(vinyl).returning();
}

export async function updateVinyl(id: number, vinyl: Partial<NewVinyl>) {
  return await db
    .update(vinyls)
    .set(vinyl)
    .where(eq(vinyls.id, id))
    .returning();
}

export async function deleteVinyl(id: number) {
  return await db.delete(vinyls).where(eq(vinyls.id, id)).returning();
}
