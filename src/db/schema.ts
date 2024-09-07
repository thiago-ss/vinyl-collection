import {
  serial,
  text,
  integer,
  timestamp,
  pgTable,
  jsonb,
} from "drizzle-orm/pg-core";

type Track = {
  id: string;
  name: string;
  duration: number;
};

export const vinyls = pgTable("vinyls", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  totalTracks: integer("total_tracks"),
  tracks: jsonb("tracks").$type<Track[]>(),
  releaseDate: text("release_date"),
  coverImage: text("cover_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Vinyl = typeof vinyls.$inferSelect;
export type NewVinyl = typeof vinyls.$inferInsert;
