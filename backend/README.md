## How to get the backend up-n-running

### Scenario 1: Local Node instance and hosted PostgreSQL server

#### Check out the repository

#### Connect to the PostgreSQL server
Quick commercial endorsement, [Neon](https://neon.com/) a serverless database that scales and branches with your app. When connected, please note the database server Host name/Address and Port.

#### Create a database
When creating the database please note the name (e.g. b2bv2). The database should be UTF-8 encoded.

#### Create a user login
Create a standard login role (e.g. b2b) and make sure to also note it (and the password):

```
CREATE ROLE b2b WITH LOGIN PASSWORD '***';
```

#### Allow the user to connect to the database:
```
GRANT CONNECT ON DATABASE b2bv2 TO b2b;
```

#### User b2b should only have data-level access:

```
REVOKE CREATE ON SCHEMA public FROM PUBLIC;

GRANT USAGE ON SCHEMA public TO b2b;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO b2b;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO b2b;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO b2b;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO b2b;
```

#### Run, as a super user, the DDL code to create the database schema.
Data definition code [here](https://raw.githubusercontent.com/hdr1001/b2b_v2/refs/heads/main/backend/postgres/sql/10-init.sql)

#### Fill out .env parameters
```
NODE_ENV=development
API_SERVER_PORT=3000

PG_HOST=[db host name here]
PG_DATABASE=b2bv2
PG_USER=b2b
PG_PASSWORD=[db password here]

DNB_DPL_KEY=[d+ key here]
DNB_DPL_SECRET=[d+ secret here]
```

#### Start the Node API server
Currently have Node v24.11 locally installed
```
cd backend/node
npm start
```

#### Stop the server
To stop the server: ctrl+c

### Scenario 2: Run the project entirely Dockerized

#### Check out the repository

#### Fill out .env.dkr.dev parameters
Use .env file .env.dkr.dev
```
NODE_ENV=development
API_SERVER_PORT=3001

PG_HOST=host.docker.internal
PG_DATABASE=b2bv2
PG_USER=postgres
PG_PORT_LOCAL=5433
PG_PORT_DKR=5432
```

#### Fill out the application secrets
In directory ~/.secrets/ make sure the following files contain the appropriate credentials:
```
pg_password
dnb_dpl_key
dnb_dpl_secret
```

#### Build the Docker images
```
cd backend
docker compose --env-file ./.env.dkr.dev build
```

#### Start the application, Postgres & Node
```
docker compose --env-file ./.env.dkr.dev up -d
```

#### Stop the server
```
docker compose --env-file ./.env.dkr.dev down
```

### Scenario 3: Run the Dockerized production version of the project 

#### Check out the repository

#### Fill out .env parameters
Use .env file .env.dkr.prod
```
NODE_ENV=production
API_SERVER_PORT=8081

PG_HOST=host.docker.internal
PG_DATABASE=b2bv2
PG_USER=postgres
PG_PORT_LOCAL=5433
PG_PORT_DKR=5432
```

#### Fill out the application secrets
In directory ~/.secrets/ make sure the following files contain the appropriate credentials:
```
pg_password
dnb_dpl_key
dnb_dpl_secret
```

#### Build the Docker images
```
cd backend
docker compose --env-file ./.env.dkr.prod build
```

#### Start the application, Postgres & Node
```
docker compose --env-file ./.env.dkr.prod up -d
```

#### Stop the server
```
docker compose --env-file ./.env.dkr.prod down
```
