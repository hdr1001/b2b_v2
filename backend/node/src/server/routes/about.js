// *********************************************************************
//
// Business-to-business application backend (v2)
// The API server /about route
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
import db from '../../share/pg.js';

const router = express.Router();

router.get('/', async (req, resp) => {
    //Basic about return object
    const ret = {
        Application: 'Business-to-business API',
        Version:     '2.0.0',
        Copyright:   '© 2026 Hans de Rooij',
        License:     'Apache 2.0',
    };

    //Get the PostgreSQL data
    const dbQryRslt = await db.query('SELECT current_database(), version()');

    //Add the PostgreSQL data if available
    if(dbQryRslt && dbQryRslt.rows && dbQryRslt.rows[0]) {
        ret.PostgreSQL = {
            database: dbQryRslt.rows[0].current_database,
            version: dbQryRslt.rows[0].version
        }
    }

    resp.json( ret );
});

export default router;
