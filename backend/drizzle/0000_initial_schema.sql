CREATE TYPE "public"."employment_status" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."roles" AS ENUM('EMPLOYEE', 'CLIENT', 'ADMIN');--> statement-breakpoint
CREATE TYPE "public"."service_orders_priorities" AS ENUM('LOW', 'NORMAL', 'HIGH', 'CRITICAL');--> statement-breakpoint
CREATE TYPE "public"."service_orders_status" AS ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELED');--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "clients_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "employees" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"phone" varchar(20) NOT NULL,
	"employee_code" varchar(50) NOT NULL,
	"employment_status" "employment_status" DEFAULT 'ACTIVE' NOT NULL,
	"hired_at" timestamp with time zone NOT NULL,
	"terminated_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "employees_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "employees_employee_code_unique" UNIQUE("employee_code")
);
--> statement-breakpoint
CREATE TABLE "service_orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"client_id" integer NOT NULL,
	"description" text NOT NULL,
	"priority" "service_orders_priorities" DEFAULT 'NORMAL' NOT NULL,
	"status" "service_orders_status" DEFAULT 'PENDING' NOT NULL,
	"responsible_id" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" "roles" NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employees" ADD CONSTRAINT "employees_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "service_orders" ADD CONSTRAINT "service_orders_responsible_id_employees_id_fk" FOREIGN KEY ("responsible_id") REFERENCES "public"."employees"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "clients_name_idx" ON "clients" USING btree ("name");--> statement-breakpoint
CREATE INDEX "employees_name_idx" ON "employees" USING btree ("name");--> statement-breakpoint
CREATE INDEX "employees_employment_status_idx" ON "employees" USING btree ("employment_status");--> statement-breakpoint
CREATE INDEX "service_orders_client_id_idx" ON "service_orders" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "service_orders_responsible_id_idx" ON "service_orders" USING btree ("responsible_id");--> statement-breakpoint
CREATE INDEX "service_orders_status_idx" ON "service_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "service_orders_priority_idx" ON "service_orders" USING btree ("priority");--> statement-breakpoint
CREATE INDEX "service_orders_created_at_idx" ON "service_orders" USING btree ("created_at");