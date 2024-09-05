import { serial, text, integer, timestamp, pgTable } from "drizzle-orm/pg-core";

export const vinyls = pgTable("vinyls", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  artist: text("artist").notNull(),
  year: integer("year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Vinyl = typeof vinyls.$inferSelect;
export type NewVinyl = typeof vinyls.$inferInsert;
