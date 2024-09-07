ALTER TABLE "vinyls" ADD COLUMN "cover_image" text;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "total_tracks" integer;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "release_date" text;--> statement-breakpoint
ALTER TABLE "vinyls" ADD COLUMN "tracks" jsonb;