CREATE TYPE "public"."referral_status" AS ENUM('pending', 'approved', 'rejected', 'paid');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('mitra');--> statement-breakpoint
CREATE TABLE "affiliate_clicks" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"link_id" integer NOT NULL,
	"ip_hash" varchar(64),
	"ua" text,
	"referer" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_links" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"code" varchar(16) NOT NULL,
	"target_url" text DEFAULT 'http://localhost:3000' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "affiliate_referrals" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"link_id" integer NOT NULL,
	"order_id" text,
	"amount" numeric(14, 2),
	"commission" numeric(14, 2),
	"status" "referral_status" DEFAULT 'pending' NOT NULL,
	"meta" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "user_role" DEFAULT 'mitra' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "affiliate_clicks" ADD CONSTRAINT "affiliate_clicks_link_id_affiliate_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."affiliate_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD CONSTRAINT "affiliate_links_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD CONSTRAINT "affiliate_referrals_link_id_affiliate_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."affiliate_links"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "affiliate_clicks_link_id_idx" ON "affiliate_clicks" USING btree ("link_id");--> statement-breakpoint
CREATE UNIQUE INDEX "affiliate_links_code_unique" ON "affiliate_links" USING btree ("code");--> statement-breakpoint
CREATE INDEX "affiliate_links_user_id_idx" ON "affiliate_links" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "affiliate_referrals_link_id_idx" ON "affiliate_referrals" USING btree ("link_id");--> statement-breakpoint
CREATE INDEX "affiliate_referrals_status_idx" ON "affiliate_referrals" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");
