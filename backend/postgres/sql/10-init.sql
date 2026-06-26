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
