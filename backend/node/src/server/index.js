// *********************************************************************
//
// Business-to-business application backend (v2)
// Entry point to the API server 
// 
// Copyright 2026 Hans de Rooij
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//       http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the
// License.
//
// *********************************************************************

import express from 'express';
import cors from 'cors';
import { B2bApiErr } from '../share/b2bApiErr.js';

//Import the API routes
import aboutRoutes from './routes/about.js';
import providersRoutes from './routes/providers.js';

//Import the API error handling middleware
import errHandler from './middleware/err.js';

//D&B Direct+ authentication
import { dnbDplAuth } from '../share/appConsts.js';

const port = process.env.API_SERVER_PORT || 8088; //Server port

//First part of the API path, e.g. http://localhost:8088/b2b/...
const path0 = 'b2b/api';

//Initialize the Express server
const app = express();
app.use( express.json() ); //Middleware to parse JSON requests

//Allow all Cross-Origin Resource Sharing requests
app.use(cors());

//Implement the API routes
app.use(`/${path0}/about`, aboutRoutes);
app.use(`/${path0}/providers`, providersRoutes);

//An HTTP request catch-all
app.use((req, resp, next) => {
    next( new B2bApiErr('unableToLocate', `Requested: ${req.path}`), req, resp );
});

//Implement the error handling middleware
app.use( errHandler );

//Start the Express server 🚀
const server = app.listen(port, err => {
    if(err) {
        console.error(`Error occurred initializing Express server, ${err.message}`)
    }
    else {
        console.log(`Now listening on port ${server.address().port}`)
    }
});

//Handle SIGINT (i.e. Ctrl+C) interrupt
process.on('SIGINT', () => {
    console.log('\nServer received SIGINT');

    server.close(() => {
        console.log('Express server closed');

        process.exit(0);
    });
});

//Get the first D&B Direct+ access token
await dnbDplAuth.getToken();

//Make sure the NODE_ENV environment variable is set
if(!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

console.log(`Running in ${process.env.NODE_ENV} mode`);
