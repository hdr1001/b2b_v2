// *********************************************************************
//
// Business-to-business application backend (v2)
// The API server /gleif routes
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
import { dcdrUtf8 } from '../../share/utils.js';
import { LeiRec } from '../../share/apiDefs.js';
import { B2bApiErr } from '../b2bApiErr.js';

const router = express.Router();

router.get(`/lei/:lei`, (req, resp, next) => {
    const leiRec = new LeiRec(req.params.lei);

    leiRec.resp
        .then( fetchResp => fetchResp.arrayBuffer() )
        .then( buffBody => resp.set('Content-Type', 'application/json').send(dcdrUtf8.decode(buffBody)) )
        .catch( err => {
            console.error(`Error occurred fetching LEI record from GLEIF API, ${err.message}`);
            next( new B2bApiErr('unableToLocate', `Requested: ${req.path}`))
        });
});

export default router;
