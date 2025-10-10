CREATE TYPE "public"."consultation_status" AS ENUM('new', 'in_review', 'contacted', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."withdraw_status" AS ENUM('pending', 'approved', 'processing', 'paid', 'rejected');--> statement-breakpoint
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_enum e
        JOIN pg_type t ON e.enumtypid = t.oid
        WHERE t.typname = 'user_role'
          AND e.enumlabel = 'admin'
    ) THEN
        ALTER TYPE "public"."user_role" ADD VALUE 'admin';
    END IF;
END;
$$;--> statement-breakpoint
CREATE TABLE "partner_bank_accounts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"bank_code" varchar(16) NOT NULL,
	"bank_name" text NOT NULL,
	"account_name" text NOT NULL,
	"account_number" varchar(64) NOT NULL,
	"is_default" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_commission_settings" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"default_rate" numeric(6, 4) DEFAULT '0.1000' NOT NULL,
	"custom_rates" jsonb,
	"effective_from" timestamp,
	"created_by" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"phone" varchar(32),
	"address" text,
	"tax_number" varchar(64),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "partner_withdraw_requests" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"amount" numeric(14, 2) NOT NULL,
	"status" "withdraw_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"bank_snapshot" jsonb NOT NULL,
	"processed_by" integer,
	"processed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "affiliate_links" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD COLUMN "payout_request_id" bigint;--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD COLUMN "paid_at" timestamp;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "status" "consultation_status" DEFAULT 'new' NOT NULL;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "assigned_to" integer;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "consultations" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "partner_bank_accounts" ADD CONSTRAINT "partner_bank_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_commission_settings" ADD CONSTRAINT "partner_commission_settings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_commission_settings" ADD CONSTRAINT "partner_commission_settings_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_profiles" ADD CONSTRAINT "partner_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_withdraw_requests" ADD CONSTRAINT "partner_withdraw_requests_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "partner_withdraw_requests" ADD CONSTRAINT "partner_withdraw_requests_processed_by_users_id_fk" FOREIGN KEY ("processed_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "partner_bank_accounts_user_id_idx" ON "partner_bank_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "partner_commission_settings_user_id_unique" ON "partner_commission_settings" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "partner_profiles_user_id_unique" ON "partner_profiles" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "partner_withdraw_requests_user_id_idx" ON "partner_withdraw_requests" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "partner_withdraw_requests_status_idx" ON "partner_withdraw_requests" USING btree ("status");--> statement-breakpoint
ALTER TABLE "affiliate_referrals" ADD CONSTRAINT "affiliate_referrals_payout_request_id_partner_withdraw_requests_id_fk" FOREIGN KEY ("payout_request_id") REFERENCES "public"."partner_withdraw_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_assigned_to_users_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;