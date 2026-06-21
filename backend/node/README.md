# Execute the B2B Node API server

## Run the server in dev mode
```cd backend/node```

```npm run dev```


## Run the server in production mode
```cd backend/node```

```npm start```


## Run the server in production mode in a Docker container
```cd backend/node```

```for i in $(cat < ../.env.dkr); do export $i;done && docker build -t b2b_api_server .```

```docker run -it b2b_api_server```

