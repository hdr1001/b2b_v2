-- Docker commands to create a development database
--
-- Pull down the image
-- docker pull postgres:18-alpine3.24
--
-- Run a PostgreSQL container based on the image
-- docker run --name postgres-18 -e POSTGRES_PASSWORD=[pwd] -p 5432:5432 -d postgres:18-alpine3.24
--
--

-- Drop the table for logging errors if it exists
DROP TABLE IF EXISTS public.b2bv2_errs;

-- Drop the table for storing GLEIF data products if it exists
DROP TABLE IF EXISTS public.products_gleif;

-- Drop the sequence for the primary key of the errors table if it exists
DROP SEQUENCE IF EXISTS public.errs_id_seq;

-- Drop the database if it exists
DROP DATABASE IF EXISTS b2b_v2;

-- Create the database
CREATE DATABASE b2b_v2;

-- Create the sequence for the primary key of table archive gleif
CREATE SEQUENCE public.archive_gleif_id_seq
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 9223372036854775807
    CACHE 1;

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

-- Create table for archiving a GLEIF data product
CREATE TABLE public.archive_gleif (
   id integer NOT NULL DEFAULT nextval('archive_gleif_id_seq'::regclass),
   lei character varying(32) COLLATE pg_catalog."default",
   product JSONB,
   product_key character(2),
   http_status smallint,
   tsz_begin timestamptz,
   tsz_end timestamptz DEFAULT CURRENT_TIMESTAMP,
   CONSTRAINT archive_gleif_pkey PRIMARY KEY (id)
);

-- Create a function to archive a GLEIF product
CREATE FUNCTION public.f_archive_gleif_product_00()
   RETURNS trigger
   LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
   INSERT INTO archive_gleif(lei, product, product_key, http_status, tsz_begin)
   VALUES (OLD.lei, OLD.product_00, '00', OLD.http_status_00, OLD.tsz_00);
   RETURN NEW;
END;
$BODY$;

-- Create a database trigger to archive a GLEIF info product on update
CREATE TRIGGER trgr_archive_gleif_product_00
   AFTER UPDATE OF product_00
   ON public.products_gleif
   FOR EACH ROW
   WHEN (OLD.product_00 IS NOT NULL)
   EXECUTE PROCEDURE public.f_archive_gleif_product_00();

-- Create a function to archive a GLEIF relation product
CREATE FUNCTION public.f_archive_gleif_product_01()
   RETURNS trigger
   LANGUAGE 'plpgsql'
AS $BODY$
BEGIN
   INSERT INTO archive_gleif(lei, product, product_key, http_status, tsz_begin)
   VALUES (OLD.lei, OLD.product_01, '01', OLD.http_status_01, OLD.tsz_01);
   RETURN NEW;
END;
$BODY$;

-- Create a database trigger to archive a GLEIF info product on update
CREATE TRIGGER trgr_archive_gleif_product_01
   AFTER UPDATE OF product_01
   ON public.products_gleif
   FOR EACH ROW
   WHEN (OLD.product_01 IS NOT NULL)
   EXECUTE PROCEDURE public.f_archive_gleif_product_01();

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
