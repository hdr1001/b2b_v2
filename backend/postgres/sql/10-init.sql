-- Docker commands to create a development database
--
-- Pull down the image
-- docker pull postgres:18-alpine3.24
--
-- Run a PostgreSQL container based on the image
-- docker run --name postgres-18 -e POSTGRES_PASSWORD=[pwd] -p 5432:5432 -d postgres:18-alpine3.24
--
--

-- Drop the database if it exists
DROP DATABASE IF EXISTS b2b_v2;

-- Drop the table for logging errors if it exists
DROP TABLE IF EXISTS public.b2bv2_errs;

-- Drop the table for storing GLEIF data products if it exists
DROP TABLE IF EXISTS public.products_gleif;

-- Drop the sequence for the primary key of the errors table if it exists
DROP SEQUENCE IF EXISTS public.errs_id_seq;

-- Create the database
CREATE DATABASE b2b_v2;

-- Create the sequence for the primary key of the errors table
CREATE SEQUENCE public.errs_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

-- Create table for storing GLEIF data products
CREATE TABLE public.products_gleif (
   lei character varying(32) NOT NULL COLLATE pg_catalog."default",
   product_00 JSONB,
   http_status_00 smallint,
   tsz_00 timestamptz,
   product_01 JSONB,
   http_status_01 smallint,
   tsz_01 timestamptz,
   CONSTRAINT products_gleif_pkey PRIMARY KEY (lei)
);

-- Create table for logging errors
CREATE TABLE public.b2bv2_errs (
   id integer NOT NULL DEFAULT nextval('errs_id_seq'::regclass),
   err_msg character varying(512),
   req_rec JSONB,
   b2b_err JSONB,
   extnl_http_status smallint,
   reported_http_status smallint,
   tsz timestamptz DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT b2bv2_errs_pkey PRIMARY KEY (id)
);
