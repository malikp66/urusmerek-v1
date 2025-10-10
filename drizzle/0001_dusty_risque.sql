CREATE TABLE "consultations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"email" text NOT NULL,
	"brand_name" text NOT NULL,
	"applicant_name" text NOT NULL,
	"service" text NOT NULL,
	"ip" text,
	"user_agent" text
);
