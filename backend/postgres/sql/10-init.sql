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

-- Drop the table for storing GLEIF data products if it exists
DROP TABLE IF EXISTS public.products_gleif;

-- Create the database
CREATE DATABASE b2b_v2;

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
