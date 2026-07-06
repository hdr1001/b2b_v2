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
import { createLeiRec } from '../../share/apiDefs.js';
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
            rec: createLeiRec(req.params.key, req.query.product)
        };

        resp.b2b = {};

        //If the forceNew query parameter is set (either as an empty string or the value 'true')
        //do not check the database for an existing record
        if(!(typeof req.query.forceNew !== 'undefined' && 
                (req.query.forceNew.length === 0 || req.query.forceNew.toLowerCase() === 'true'))) {
            resp.b2b.sqlSelect = await db.query( req.b2b.rec.sqlSelect, [req.b2b.rec.key] )
        };

        //If the LEI record is found in the database, return it; otherwise, fetch it from the external API
        if( resp.b2b.sqlSelect && resp.b2b.sqlSelect.rows.length &&
            resp.b2b.sqlSelect.rows[0][`product_${req.b2b.rec.productNum}`] &&
            resp.b2b.sqlSelect.rows[0][`http_status_${req.b2b.rec.productNum}`] >= 200 &&
            resp.b2b.sqlSelect.rows[0][`http_status_${req.b2b.rec.productNum}`] < 300 )
        {
            //Set response headers
            resp.set({
                'Content-Type': 'application/json',
                'X-B2BV2-Cache': true,
                'X-B2BV2-Obtained-At': new Date(resp.b2b.sqlSelect.rows[0][`tsz_${req.b2b.rec.productNum}`]).toISOString()
            });

            return resp.send(resp.b2b.sqlSelect.rows[0][`product_${req.b2b.rec.productNum}`]);
        }

        //Timestamp the request
        req.b2b.tsz = Date.now();

        //If the LEI record is not found in the database, fetch it from the external API
        resp.b2b.fetchResp = await fetch(req.b2b.rec.getFetchReqObj());

        //Timestamp the resonse
        resp.b2b.tsz = Date.now();

        //Log the response status time it took to get the response from the external API
        //console.log(`External API responded with status ${resp.b2b.fetchResp.status} for key ${req.b2b.rec.key} in ${resp.b2b.tsz - req.b2b.tsz} ms`);

        //Read the response body as an ArrayBuffer
        resp.b2b.arrBuff = await resp.b2b.fetchResp.arrayBuffer();

        //Check if the external API responded with an HTTP error status
        if(!resp.b2b.fetchResp.ok) {
            throw new B2bApiErr(
                'extnlApiErr',
                `External API responded with an HTTP error status: ${resp.b2b.fetchResp.status}`,
                resp.b2b.fetchResp.status,
                dcdrUtf8.decode(resp.b2b.arrBuff)
            )
        }

        //Decode the response body from the external API
        const sRespBody = dcdrUtf8.decode(resp.b2b.arrBuff);

        //Set response headers
        resp.set({
            'Content-Type': 'application/json',
            'X-B2BV2-Cache': false,
            'X-B2BV2-Obtained-At': new Date(resp.b2b.tsz).toISOString(),
            'X-B2BV2-Extnl-API-Status': resp.b2b.fetchResp.status          
        });

        //Return the response body to the client and upsert it into the database
        resp.send(sRespBody);

        //Update the database with the LEI record, using an upsert operation
        const sqlUpsert = await db.query( req.b2b.rec.sqlUpsert, [ req.b2b.rec.key, sRespBody, resp.b2b.fetchResp.status ] );

        //Check if the upsert operation affected exactly one row in the database
        if(sqlUpsert.rowCount !== 1) {
            console.error(`Unexpected rowCount from SQL upsert. Expected 1, got ${sqlUpsert.rowCount}`);
        };
    }
    catch(err) {
        if(err instanceof B2bApiErr) return next(err);

        console.error(err.stack || err);

        next( new B2bApiErr('unexpected', `Unexpected error in /gleif/lei/${req.params.key}, ${err.message} (${err.cause})`) );
    }
});

export default router;
