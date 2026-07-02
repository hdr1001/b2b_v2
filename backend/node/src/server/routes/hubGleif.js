// *********************************************************************
//
// Business-to-business application backend (v2)
// The API server /hub/gleif routes
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
import appConsts from '../../share/appConsts.js';
import { LeiRec } from '../../share/apiDefs.js';
import apiKeyReq from '../../share/apiReq.js';
import { B2bApiErr } from '../../share/b2bApiErr.js';
import db from '../../share/pg.js';

const router = express.Router();

router.get('/', (req, resp) => {
    resp.json( appConsts.providers.gleif );
});

router.get(`/lei/:key`, async(req, resp, next) => {
    try{
        //Instantiate a new LeiRec object with the LEI key from the request parameters
        req.b2b = {
            rec: new LeiRec(req.params.key)
        };

        //Validate the LEI key
        if(!req.b2b.rec.validateKey()) throw new B2bApiErr('invalidParameter', `Invalid LEI: ${req.b2b.rec.key}`);

        //Check if the LEI record is already in the database
        resp.b2b = {
            sqlSelect: await db.query( appConsts.gleifProduct_00.sqlSelect, [req.b2b.rec.key] )
        };

        //If the LEI record is found in the database, return it; otherwise, fetch it from the external API
        if(resp.b2b.sqlSelect && resp.b2b.sqlSelect.rows.length) {
            return resp.set('Content-Type', 'application/json').send(resp.b2b.sqlSelect.rows[0].product_00);
        }
        else {
            await apiKeyReq(req, resp, next);
        }

        //Decode the response body from the external API
        const sRespBody = dcdrUtf8.decode(resp.b2b.arrBuff);

        //Return the response body to the client and upsert it into the database
        resp.set('Content-Type', 'application/json').send(sRespBody);

        const sqlUpsert = await db.query( appConsts.gleifProduct_00.sqlUpsert, [ req.b2b.rec.key, sRespBody, resp.b2b.fetchResp.status ] );
    }
    catch(err) {
        if(err instanceof B2bApiErr) return next(err);

        next( new B2bApiErr('unexpected', `Unexpected error in /gleif/lei/${req.params.key}, ${err.message} (${err.cause})`) );
    }
});

export default router;
