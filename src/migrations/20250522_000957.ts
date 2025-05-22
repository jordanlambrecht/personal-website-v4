import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_product_design_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_design_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_other_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__other_projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_product_files_file_type" AS ENUM('stl', 'gltf', 'glb', 'zip', 'other');
  CREATE TYPE "public"."enum_media_file_type" AS ENUM('image', 'video', 'document', 'general');
  CREATE TYPE "public"."enum_lists_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lists_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_open_source_documents_resource_type" AS ENUM('file', 'link');
  CREATE TYPE "public"."enum_open_source_documents_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__open_source_documents_v_version_resource_type" AS ENUM('file', 'link');
  CREATE TYPE "public"."enum__open_source_documents_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_redirects_to_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE IF NOT EXISTS "product_design_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "product_design_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "product_design" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"details" jsonb,
  	"enable_extra_images" boolean DEFAULT false,
  	"enable_written_content" boolean DEFAULT false,
  	"extra_rich_text_content" jsonb,
  	"visibility_visibility_home" boolean DEFAULT true,
  	"visibility_visibility_collection_page" boolean DEFAULT true,
  	"sorting_pinned" boolean DEFAULT false,
  	"sorting_favorited" boolean DEFAULT false,
  	"enable_makerworld" boolean DEFAULT false,
  	"enable_download" boolean DEFAULT false,
  	"enable_purchase" boolean DEFAULT false,
  	"maker_world_link" varchar,
  	"download_link_id" integer,
  	"purchase_link" varchar,
  	"project_type_id" integer,
  	"date_published" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_product_design_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "product_design_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_product_design_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_product_design_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_product_design_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_image_id" integer,
  	"version_description" varchar,
  	"version_details" jsonb,
  	"version_enable_extra_images" boolean DEFAULT false,
  	"version_enable_written_content" boolean DEFAULT false,
  	"version_extra_rich_text_content" jsonb,
  	"version_visibility_visibility_home" boolean DEFAULT true,
  	"version_visibility_visibility_collection_page" boolean DEFAULT true,
  	"version_sorting_pinned" boolean DEFAULT false,
  	"version_sorting_favorited" boolean DEFAULT false,
  	"version_enable_makerworld" boolean DEFAULT false,
  	"version_enable_download" boolean DEFAULT false,
  	"version_enable_purchase" boolean DEFAULT false,
  	"version_maker_world_link" varchar,
  	"version_download_link_id" integer,
  	"version_purchase_link" varchar,
  	"version_project_type_id" integer,
  	"version_date_published" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__product_design_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_product_design_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "other_projects_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "other_projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"image_id" integer,
  	"description" varchar,
  	"details" jsonb,
  	"enable_extra_images" boolean DEFAULT false,
  	"enable_written_content" boolean DEFAULT false,
  	"extra_rich_text_content" jsonb,
  	"visibility_visibility_home" boolean DEFAULT true,
  	"visibility_visibility_collection_page" boolean DEFAULT true,
  	"project_label_id" integer,
  	"project_link" varchar,
  	"sorting_pinned" boolean,
  	"sorting_favorited" boolean DEFAULT false,
  	"date_completed" timestamp(3) with time zone,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_other_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "other_projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_other_projects_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "_other_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_image_id" integer,
  	"version_description" varchar,
  	"version_details" jsonb,
  	"version_enable_extra_images" boolean DEFAULT false,
  	"version_enable_written_content" boolean DEFAULT false,
  	"version_extra_rich_text_content" jsonb,
  	"version_visibility_visibility_home" boolean DEFAULT true,
  	"version_visibility_visibility_collection_page" boolean DEFAULT true,
  	"version_project_label_id" integer,
  	"version_project_link" varchar,
  	"version_sorting_pinned" boolean,
  	"version_sorting_favorited" boolean DEFAULT false,
  	"version_date_completed" timestamp(3) with time zone,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__other_projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_other_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "product_files" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"file_description" varchar,
  	"file_size" numeric,
  	"file_type" "enum_product_files_file_type" DEFAULT 'stl',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"username" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"file_type" "enum_media_file_type",
  	"prefix" varchar DEFAULT 'uploads_default/',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar NOT NULL,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "docs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"prefix" varchar DEFAULT 'docs/',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar NOT NULL,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "lists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"published_at" timestamp(3) with time zone,
  	"title" varchar,
  	"images_id" integer,
  	"content_emoji" varchar,
  	"content_subheader" varchar,
  	"content_things" jsonb,
  	"sorting_pinned" boolean DEFAULT false,
  	"sorting_favorited" boolean DEFAULT false,
  	"visibility_visibility_home" boolean DEFAULT true,
  	"visibility_visibility_collection_page" boolean DEFAULT true,
  	"project_type_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lists_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "_lists_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_title" varchar,
  	"version_images_id" integer,
  	"version_content_emoji" varchar,
  	"version_content_subheader" varchar,
  	"version_content_things" jsonb,
  	"version_sorting_pinned" boolean DEFAULT false,
  	"version_sorting_favorited" boolean DEFAULT false,
  	"version_visibility_visibility_home" boolean DEFAULT true,
  	"version_visibility_visibility_collection_page" boolean DEFAULT true,
  	"version_project_type_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lists_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "labels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"color_label_name" varchar,
  	"bg_color" varchar NOT NULL,
  	"text_color" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pb_artifact_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pb_artifact_tags" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "open_source_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"_open_source_documents_usedinopensourcedocuments_order" varchar,
  	"title" varchar,
  	"published_date" timestamp(3) with time zone,
  	"pb_artifact_category_id" integer,
  	"short_description" varchar,
  	"resource_type" "enum_open_source_documents_resource_type" DEFAULT 'file',
  	"document_file_id" integer,
  	"document_link_id" integer,
  	"slug" varchar,
  	"slug_lock" boolean DEFAULT true,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_open_source_documents_status" DEFAULT 'draft'
  );
  
  CREATE TABLE IF NOT EXISTS "open_source_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pb_artifact_tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "_open_source_documents_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version__open_source_documents_usedinopensourcedocuments_order" varchar,
  	"version_title" varchar,
  	"version_published_date" timestamp(3) with time zone,
  	"version_pb_artifact_category_id" integer,
  	"version_short_description" varchar,
  	"version_resource_type" "enum__open_source_documents_v_version_resource_type" DEFAULT 'file',
  	"version_document_file_id" integer,
  	"version_document_link_id" integer,
  	"version_slug" varchar,
  	"version_slug_lock" boolean DEFAULT true,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__open_source_documents_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE IF NOT EXISTS "_open_source_documents_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pb_artifact_tags_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to_type" "enum_redirects_to_type" DEFAULT 'reference',
  	"to_url" varchar,
  	"type" "enum_redirects_type" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "redirects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_design_id" integer,
  	"lists_id" integer,
  	"other_projects_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE IF NOT EXISTS "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"product_design_id" integer,
  	"other_projects_id" integer,
  	"product_files_id" integer,
  	"links_id" integer,
  	"users_id" integer,
  	"media_id" integer,
  	"docs_id" integer,
  	"lists_id" integer,
  	"labels_id" integer,
  	"pb_artifact_categories_id" integer,
  	"pb_artifact_tags_id" integer,
  	"open_source_documents_id" integer,
  	"redirects_id" integer,
  	"payload_jobs_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"maintenance_mode" boolean DEFAULT false,
  	"show_pixel_bakery" boolean DEFAULT true,
  	"show_product_designs" boolean DEFAULT true,
  	"show_other_projects" boolean DEFAULT true,
  	"show_lists" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "site_distractions_distraction_items_photo_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_text" varchar NOT NULL,
  	"image_filename" varchar NOT NULL,
  	"caption" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_distractions_distraction_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"active" boolean DEFAULT true NOT NULL,
  	"icon" varchar,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_distractions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "site_social_links_social_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"url" varchar NOT NULL,
  	"active" boolean DEFAULT true NOT NULL,
  	"target_blank" boolean DEFAULT true NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "site_social_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DO $$ BEGIN
   ALTER TABLE "product_design_tags" ADD CONSTRAINT "product_design_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_design"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design_breadcrumbs" ADD CONSTRAINT "product_design_breadcrumbs_doc_id_product_design_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."product_design"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design_breadcrumbs" ADD CONSTRAINT "product_design_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_design"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design" ADD CONSTRAINT "product_design_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design" ADD CONSTRAINT "product_design_download_link_id_product_files_id_fk" FOREIGN KEY ("download_link_id") REFERENCES "public"."product_files"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design" ADD CONSTRAINT "product_design_project_type_id_labels_id_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."labels"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design" ADD CONSTRAINT "product_design_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design" ADD CONSTRAINT "product_design_parent_id_product_design_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_design"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design_rels" ADD CONSTRAINT "product_design_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_design"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "product_design_rels" ADD CONSTRAINT "product_design_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v_version_tags" ADD CONSTRAINT "_product_design_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_design_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v_version_breadcrumbs" ADD CONSTRAINT "_product_design_v_version_breadcrumbs_doc_id_product_design_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."product_design"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v_version_breadcrumbs" ADD CONSTRAINT "_product_design_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_design_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v" ADD CONSTRAINT "_product_design_v_parent_id_product_design_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_design"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v" ADD CONSTRAINT "_product_design_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v" ADD CONSTRAINT "_product_design_v_version_download_link_id_product_files_id_fk" FOREIGN KEY ("version_download_link_id") REFERENCES "public"."product_files"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v" ADD CONSTRAINT "_product_design_v_version_project_type_id_labels_id_fk" FOREIGN KEY ("version_project_type_id") REFERENCES "public"."labels"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v" ADD CONSTRAINT "_product_design_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v" ADD CONSTRAINT "_product_design_v_version_parent_id_product_design_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."product_design"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v_rels" ADD CONSTRAINT "_product_design_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_product_design_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_product_design_v_rels" ADD CONSTRAINT "_product_design_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "other_projects_tags" ADD CONSTRAINT "other_projects_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."other_projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "other_projects" ADD CONSTRAINT "other_projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "other_projects" ADD CONSTRAINT "other_projects_project_label_id_labels_id_fk" FOREIGN KEY ("project_label_id") REFERENCES "public"."labels"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "other_projects" ADD CONSTRAINT "other_projects_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "other_projects_rels" ADD CONSTRAINT "other_projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."other_projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "other_projects_rels" ADD CONSTRAINT "other_projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_other_projects_v_version_tags" ADD CONSTRAINT "_other_projects_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_other_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_other_projects_v" ADD CONSTRAINT "_other_projects_v_parent_id_other_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."other_projects"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_other_projects_v" ADD CONSTRAINT "_other_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_other_projects_v" ADD CONSTRAINT "_other_projects_v_version_project_label_id_labels_id_fk" FOREIGN KEY ("version_project_label_id") REFERENCES "public"."labels"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_other_projects_v" ADD CONSTRAINT "_other_projects_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_other_projects_v_rels" ADD CONSTRAINT "_other_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_other_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_other_projects_v_rels" ADD CONSTRAINT "_other_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "lists" ADD CONSTRAINT "lists_images_id_media_id_fk" FOREIGN KEY ("images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "lists" ADD CONSTRAINT "lists_project_type_id_labels_id_fk" FOREIGN KEY ("project_type_id") REFERENCES "public"."labels"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "lists" ADD CONSTRAINT "lists_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lists_v" ADD CONSTRAINT "_lists_v_parent_id_lists_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lists"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lists_v" ADD CONSTRAINT "_lists_v_version_images_id_media_id_fk" FOREIGN KEY ("version_images_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lists_v" ADD CONSTRAINT "_lists_v_version_project_type_id_labels_id_fk" FOREIGN KEY ("version_project_type_id") REFERENCES "public"."labels"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_lists_v" ADD CONSTRAINT "_lists_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "open_source_documents" ADD CONSTRAINT "open_source_documents_pb_artifact_category_id_pb_artifact_categories_id_fk" FOREIGN KEY ("pb_artifact_category_id") REFERENCES "public"."pb_artifact_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "open_source_documents" ADD CONSTRAINT "open_source_documents_document_file_id_docs_id_fk" FOREIGN KEY ("document_file_id") REFERENCES "public"."docs"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "open_source_documents" ADD CONSTRAINT "open_source_documents_document_link_id_links_id_fk" FOREIGN KEY ("document_link_id") REFERENCES "public"."links"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "open_source_documents" ADD CONSTRAINT "open_source_documents_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "open_source_documents_rels" ADD CONSTRAINT "open_source_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."open_source_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "open_source_documents_rels" ADD CONSTRAINT "open_source_documents_rels_pb_artifact_tags_fk" FOREIGN KEY ("pb_artifact_tags_id") REFERENCES "public"."pb_artifact_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_open_source_documents_v" ADD CONSTRAINT "_open_source_documents_v_parent_id_open_source_documents_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."open_source_documents"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_open_source_documents_v" ADD CONSTRAINT "_open_source_documents_v_version_pb_artifact_category_id_pb_artifact_categories_id_fk" FOREIGN KEY ("version_pb_artifact_category_id") REFERENCES "public"."pb_artifact_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_open_source_documents_v" ADD CONSTRAINT "_open_source_documents_v_version_document_file_id_docs_id_fk" FOREIGN KEY ("version_document_file_id") REFERENCES "public"."docs"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_open_source_documents_v" ADD CONSTRAINT "_open_source_documents_v_version_document_link_id_links_id_fk" FOREIGN KEY ("version_document_link_id") REFERENCES "public"."links"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_open_source_documents_v" ADD CONSTRAINT "_open_source_documents_v_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_open_source_documents_v_rels" ADD CONSTRAINT "_open_source_documents_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_open_source_documents_v"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "_open_source_documents_v_rels" ADD CONSTRAINT "_open_source_documents_v_rels_pb_artifact_tags_fk" FOREIGN KEY ("pb_artifact_tags_id") REFERENCES "public"."pb_artifact_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_product_design_fk" FOREIGN KEY ("product_design_id") REFERENCES "public"."product_design"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_lists_fk" FOREIGN KEY ("lists_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "redirects_rels" ADD CONSTRAINT "redirects_rels_other_projects_fk" FOREIGN KEY ("other_projects_id") REFERENCES "public"."other_projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_design_fk" FOREIGN KEY ("product_design_id") REFERENCES "public"."product_design"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_other_projects_fk" FOREIGN KEY ("other_projects_id") REFERENCES "public"."other_projects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_files_fk" FOREIGN KEY ("product_files_id") REFERENCES "public"."product_files"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_links_fk" FOREIGN KEY ("links_id") REFERENCES "public"."links"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_docs_fk" FOREIGN KEY ("docs_id") REFERENCES "public"."docs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lists_fk" FOREIGN KEY ("lists_id") REFERENCES "public"."lists"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_labels_fk" FOREIGN KEY ("labels_id") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pb_artifact_categories_fk" FOREIGN KEY ("pb_artifact_categories_id") REFERENCES "public"."pb_artifact_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pb_artifact_tags_fk" FOREIGN KEY ("pb_artifact_tags_id") REFERENCES "public"."pb_artifact_tags"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_open_source_documents_fk" FOREIGN KEY ("open_source_documents_id") REFERENCES "public"."open_source_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_jobs_fk" FOREIGN KEY ("payload_jobs_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_distractions_distraction_items_photo_links" ADD CONSTRAINT "site_distractions_distraction_items_photo_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_distractions_distraction_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_distractions_distraction_items" ADD CONSTRAINT "site_distractions_distraction_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_distractions"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "site_social_links_social_links" ADD CONSTRAINT "site_social_links_social_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_social_links"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "product_design_tags_order_idx" ON "product_design_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "product_design_tags_parent_id_idx" ON "product_design_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "product_design_breadcrumbs_order_idx" ON "product_design_breadcrumbs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "product_design_breadcrumbs_parent_id_idx" ON "product_design_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "product_design_breadcrumbs_doc_idx" ON "product_design_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX IF NOT EXISTS "product_design_image_idx" ON "product_design" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "product_design_visibility_visibility_visibility_home_idx" ON "product_design" USING btree ("visibility_visibility_home");
  CREATE INDEX IF NOT EXISTS "product_design_visibility_visibility_visibility_collection_page_idx" ON "product_design" USING btree ("visibility_visibility_collection_page");
  CREATE INDEX IF NOT EXISTS "product_design_download_link_idx" ON "product_design" USING btree ("download_link_id");
  CREATE INDEX IF NOT EXISTS "product_design_project_type_idx" ON "product_design" USING btree ("project_type_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "product_design_slug_idx" ON "product_design" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "product_design_meta_meta_image_idx" ON "product_design" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "product_design_parent_idx" ON "product_design" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "product_design_updated_at_idx" ON "product_design" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "product_design_created_at_idx" ON "product_design" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "product_design__status_idx" ON "product_design" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "product_design_rels_order_idx" ON "product_design_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "product_design_rels_parent_idx" ON "product_design_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "product_design_rels_path_idx" ON "product_design_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "product_design_rels_media_id_idx" ON "product_design_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_tags_order_idx" ON "_product_design_v_version_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_tags_parent_id_idx" ON "_product_design_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_breadcrumbs_order_idx" ON "_product_design_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_breadcrumbs_parent_id_idx" ON "_product_design_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_breadcrumbs_doc_idx" ON "_product_design_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_parent_idx" ON "_product_design_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_version_image_idx" ON "_product_design_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_visibility_version_visibility_visibility_home_idx" ON "_product_design_v" USING btree ("version_visibility_visibility_home");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_visibility_version_visibility_visibility_collection_page_idx" ON "_product_design_v" USING btree ("version_visibility_visibility_collection_page");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_version_download_link_idx" ON "_product_design_v" USING btree ("version_download_link_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_version_project_type_idx" ON "_product_design_v" USING btree ("version_project_type_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_version_slug_idx" ON "_product_design_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_meta_version_meta_image_idx" ON "_product_design_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_version_parent_idx" ON "_product_design_v" USING btree ("version_parent_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_version_updated_at_idx" ON "_product_design_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_version_created_at_idx" ON "_product_design_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_product_design_v_version_version__status_idx" ON "_product_design_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_product_design_v_created_at_idx" ON "_product_design_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_product_design_v_updated_at_idx" ON "_product_design_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_product_design_v_latest_idx" ON "_product_design_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_product_design_v_autosave_idx" ON "_product_design_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_product_design_v_rels_order_idx" ON "_product_design_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_product_design_v_rels_parent_idx" ON "_product_design_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_product_design_v_rels_path_idx" ON "_product_design_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_product_design_v_rels_media_id_idx" ON "_product_design_v_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "other_projects_tags_order_idx" ON "other_projects_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "other_projects_tags_parent_id_idx" ON "other_projects_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "other_projects_image_idx" ON "other_projects" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "other_projects_visibility_visibility_visibility_home_idx" ON "other_projects" USING btree ("visibility_visibility_home");
  CREATE INDEX IF NOT EXISTS "other_projects_visibility_visibility_visibility_collection_page_idx" ON "other_projects" USING btree ("visibility_visibility_collection_page");
  CREATE INDEX IF NOT EXISTS "other_projects_project_label_idx" ON "other_projects" USING btree ("project_label_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "other_projects_slug_idx" ON "other_projects" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "other_projects_meta_meta_image_idx" ON "other_projects" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "other_projects_updated_at_idx" ON "other_projects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "other_projects_created_at_idx" ON "other_projects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "other_projects__status_idx" ON "other_projects" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "other_projects_rels_order_idx" ON "other_projects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "other_projects_rels_parent_idx" ON "other_projects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "other_projects_rels_path_idx" ON "other_projects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "other_projects_rels_media_id_idx" ON "other_projects_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_tags_order_idx" ON "_other_projects_v_version_tags" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_tags_parent_id_idx" ON "_other_projects_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_parent_idx" ON "_other_projects_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_version_image_idx" ON "_other_projects_v" USING btree ("version_image_id");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_visibility_version_visibility_visibility_home_idx" ON "_other_projects_v" USING btree ("version_visibility_visibility_home");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_visibility_version_visibility_visibility_collection_page_idx" ON "_other_projects_v" USING btree ("version_visibility_visibility_collection_page");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_version_project_label_idx" ON "_other_projects_v" USING btree ("version_project_label_id");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_version_slug_idx" ON "_other_projects_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_meta_version_meta_image_idx" ON "_other_projects_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_version_updated_at_idx" ON "_other_projects_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_version_created_at_idx" ON "_other_projects_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_version_version__status_idx" ON "_other_projects_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_created_at_idx" ON "_other_projects_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_updated_at_idx" ON "_other_projects_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_latest_idx" ON "_other_projects_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_autosave_idx" ON "_other_projects_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_rels_order_idx" ON "_other_projects_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_rels_parent_idx" ON "_other_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_rels_path_idx" ON "_other_projects_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_other_projects_v_rels_media_id_idx" ON "_other_projects_v_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "product_files_updated_at_idx" ON "product_files" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "product_files_created_at_idx" ON "product_files" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "product_files_filename_idx" ON "product_files" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "links_updated_at_idx" ON "links" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "links_created_at_idx" ON "links" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_username_idx" ON "users" USING btree ("username");
  CREATE INDEX IF NOT EXISTS "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "docs_updated_at_idx" ON "docs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "docs_created_at_idx" ON "docs" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "docs_filename_idx" ON "docs" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "lists_images_idx" ON "lists" USING btree ("images_id");
  CREATE INDEX IF NOT EXISTS "lists_visibility_visibility_visibility_home_idx" ON "lists" USING btree ("visibility_visibility_home");
  CREATE INDEX IF NOT EXISTS "lists_visibility_visibility_visibility_collection_page_idx" ON "lists" USING btree ("visibility_visibility_collection_page");
  CREATE INDEX IF NOT EXISTS "lists_project_type_idx" ON "lists" USING btree ("project_type_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "lists_slug_idx" ON "lists" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "lists_meta_meta_image_idx" ON "lists" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "lists_updated_at_idx" ON "lists" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "lists_created_at_idx" ON "lists" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "lists__status_idx" ON "lists" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "_lists_v_parent_idx" ON "_lists_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_version_images_idx" ON "_lists_v" USING btree ("version_images_id");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_visibility_version_visibility_visibility_home_idx" ON "_lists_v" USING btree ("version_visibility_visibility_home");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_visibility_version_visibility_visibility_collection_page_idx" ON "_lists_v" USING btree ("version_visibility_visibility_collection_page");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_version_project_type_idx" ON "_lists_v" USING btree ("version_project_type_id");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_version_slug_idx" ON "_lists_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_meta_version_meta_image_idx" ON "_lists_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_version_updated_at_idx" ON "_lists_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_version_created_at_idx" ON "_lists_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_lists_v_version_version__status_idx" ON "_lists_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_lists_v_created_at_idx" ON "_lists_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_lists_v_updated_at_idx" ON "_lists_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_lists_v_latest_idx" ON "_lists_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_lists_v_autosave_idx" ON "_lists_v" USING btree ("autosave");
  CREATE UNIQUE INDEX IF NOT EXISTS "labels_name_idx" ON "labels" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "labels_updated_at_idx" ON "labels" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "labels_created_at_idx" ON "labels" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "pb_artifact_categories_name_idx" ON "pb_artifact_categories" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "pb_artifact_categories_updated_at_idx" ON "pb_artifact_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pb_artifact_categories_created_at_idx" ON "pb_artifact_categories" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "pb_artifact_tags_name_idx" ON "pb_artifact_tags" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "pb_artifact_tags_updated_at_idx" ON "pb_artifact_tags" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pb_artifact_tags_created_at_idx" ON "pb_artifact_tags" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "open_source_documents__open_source_documents_usedinopensourcedocuments_order_idx" ON "open_source_documents" USING btree ("_open_source_documents_usedinopensourcedocuments_order");
  CREATE INDEX IF NOT EXISTS "open_source_documents_pb_artifact_category_idx" ON "open_source_documents" USING btree ("pb_artifact_category_id");
  CREATE INDEX IF NOT EXISTS "open_source_documents_document_file_idx" ON "open_source_documents" USING btree ("document_file_id");
  CREATE INDEX IF NOT EXISTS "open_source_documents_document_link_idx" ON "open_source_documents" USING btree ("document_link_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "open_source_documents_slug_idx" ON "open_source_documents" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "open_source_documents_meta_meta_image_idx" ON "open_source_documents" USING btree ("meta_image_id");
  CREATE INDEX IF NOT EXISTS "open_source_documents_updated_at_idx" ON "open_source_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "open_source_documents_created_at_idx" ON "open_source_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "open_source_documents__status_idx" ON "open_source_documents" USING btree ("_status");
  CREATE INDEX IF NOT EXISTS "open_source_documents_rels_order_idx" ON "open_source_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "open_source_documents_rels_parent_idx" ON "open_source_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "open_source_documents_rels_path_idx" ON "open_source_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "open_source_documents_rels_pb_artifact_tags_id_idx" ON "open_source_documents_rels" USING btree ("pb_artifact_tags_id");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_parent_idx" ON "_open_source_documents_v" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_version__open_source_documents_usedinopensourcedocuments_order_idx" ON "_open_source_documents_v" USING btree ("version__open_source_documents_usedinopensourcedocuments_order");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_version_pb_artifact_category_idx" ON "_open_source_documents_v" USING btree ("version_pb_artifact_category_id");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_version_document_file_idx" ON "_open_source_documents_v" USING btree ("version_document_file_id");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_version_document_link_idx" ON "_open_source_documents_v" USING btree ("version_document_link_id");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_version_slug_idx" ON "_open_source_documents_v" USING btree ("version_slug");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_meta_version_meta_image_idx" ON "_open_source_documents_v" USING btree ("version_meta_image_id");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_version_updated_at_idx" ON "_open_source_documents_v" USING btree ("version_updated_at");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_version_created_at_idx" ON "_open_source_documents_v" USING btree ("version_created_at");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_version_version__status_idx" ON "_open_source_documents_v" USING btree ("version__status");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_created_at_idx" ON "_open_source_documents_v" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_updated_at_idx" ON "_open_source_documents_v" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_latest_idx" ON "_open_source_documents_v" USING btree ("latest");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_autosave_idx" ON "_open_source_documents_v" USING btree ("autosave");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_rels_order_idx" ON "_open_source_documents_v_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_rels_parent_idx" ON "_open_source_documents_v_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_rels_path_idx" ON "_open_source_documents_v_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "_open_source_documents_v_rels_pb_artifact_tags_id_idx" ON "_open_source_documents_v_rels" USING btree ("pb_artifact_tags_id");
  CREATE INDEX IF NOT EXISTS "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX IF NOT EXISTS "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "redirects_rels_order_idx" ON "redirects_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "redirects_rels_parent_idx" ON "redirects_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_path_idx" ON "redirects_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "redirects_rels_product_design_id_idx" ON "redirects_rels" USING btree ("product_design_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_lists_id_idx" ON "redirects_rels" USING btree ("lists_id");
  CREATE INDEX IF NOT EXISTS "redirects_rels_other_projects_id_idx" ON "redirects_rels" USING btree ("other_projects_id");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX IF NOT EXISTS "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX IF NOT EXISTS "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX IF NOT EXISTS "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX IF NOT EXISTS "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX IF NOT EXISTS "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX IF NOT EXISTS "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_design_id_idx" ON "payload_locked_documents_rels" USING btree ("product_design_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_other_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("other_projects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_product_files_id_idx" ON "payload_locked_documents_rels" USING btree ("product_files_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_links_id_idx" ON "payload_locked_documents_rels" USING btree ("links_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_docs_id_idx" ON "payload_locked_documents_rels" USING btree ("docs_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_lists_id_idx" ON "payload_locked_documents_rels" USING btree ("lists_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_labels_id_idx" ON "payload_locked_documents_rels" USING btree ("labels_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pb_artifact_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("pb_artifact_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pb_artifact_tags_id_idx" ON "payload_locked_documents_rels" USING btree ("pb_artifact_tags_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_open_source_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("open_source_documents_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_payload_jobs_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_jobs_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "site_distractions_distraction_items_photo_links_order_idx" ON "site_distractions_distraction_items_photo_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_distractions_distraction_items_photo_links_parent_id_idx" ON "site_distractions_distraction_items_photo_links" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "site_distractions_distraction_items_order_idx" ON "site_distractions_distraction_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_distractions_distraction_items_parent_id_idx" ON "site_distractions_distraction_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "site_social_links_social_links_order_idx" ON "site_social_links_social_links" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "site_social_links_social_links_parent_id_idx" ON "site_social_links_social_links" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "product_design_tags" CASCADE;
  DROP TABLE "product_design_breadcrumbs" CASCADE;
  DROP TABLE "product_design" CASCADE;
  DROP TABLE "product_design_rels" CASCADE;
  DROP TABLE "_product_design_v_version_tags" CASCADE;
  DROP TABLE "_product_design_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_product_design_v" CASCADE;
  DROP TABLE "_product_design_v_rels" CASCADE;
  DROP TABLE "other_projects_tags" CASCADE;
  DROP TABLE "other_projects" CASCADE;
  DROP TABLE "other_projects_rels" CASCADE;
  DROP TABLE "_other_projects_v_version_tags" CASCADE;
  DROP TABLE "_other_projects_v" CASCADE;
  DROP TABLE "_other_projects_v_rels" CASCADE;
  DROP TABLE "product_files" CASCADE;
  DROP TABLE "links" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "docs" CASCADE;
  DROP TABLE "lists" CASCADE;
  DROP TABLE "_lists_v" CASCADE;
  DROP TABLE "labels" CASCADE;
  DROP TABLE "pb_artifact_categories" CASCADE;
  DROP TABLE "pb_artifact_tags" CASCADE;
  DROP TABLE "open_source_documents" CASCADE;
  DROP TABLE "open_source_documents_rels" CASCADE;
  DROP TABLE "_open_source_documents_v" CASCADE;
  DROP TABLE "_open_source_documents_v_rels" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "redirects_rels" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_distractions_distraction_items_photo_links" CASCADE;
  DROP TABLE "site_distractions_distraction_items" CASCADE;
  DROP TABLE "site_distractions" CASCADE;
  DROP TABLE "site_social_links_social_links" CASCADE;
  DROP TABLE "site_social_links" CASCADE;
  DROP TYPE "public"."enum_product_design_status";
  DROP TYPE "public"."enum__product_design_v_version_status";
  DROP TYPE "public"."enum_other_projects_status";
  DROP TYPE "public"."enum__other_projects_v_version_status";
  DROP TYPE "public"."enum_product_files_file_type";
  DROP TYPE "public"."enum_media_file_type";
  DROP TYPE "public"."enum_lists_status";
  DROP TYPE "public"."enum__lists_v_version_status";
  DROP TYPE "public"."enum_open_source_documents_resource_type";
  DROP TYPE "public"."enum_open_source_documents_status";
  DROP TYPE "public"."enum__open_source_documents_v_version_resource_type";
  DROP TYPE "public"."enum__open_source_documents_v_version_status";
  DROP TYPE "public"."enum_redirects_to_type";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
