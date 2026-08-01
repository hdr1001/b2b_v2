Connect to the PostgreSQL server. Note the server Host name/Address and Port.


Create a database (example b2bv2). Make sure the encoding is UTF-8. Note the database name.


Create a standard login role and make sure to note it:

CREATE ROLE b2b WITH LOGIN PASSWORD '***';


Allow user b2b to connect to the database:

GRANT CONNECT ON DATABASE b2bv2 TO b2b;


User b2b should only have data-level access:

REVOKE CREATE ON SCHEMA public FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO b2b;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO b2b;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO b2b;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO b2b;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
GRANT USAGE, SELECT ON SEQUENCES TO b2b;


As super user run the DDL code to create the database schema.


Fill out .env parameters


cd backend/node


npm start


stop the server ctrl+c
