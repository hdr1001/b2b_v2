// *********************************************************************
//
// Business-to-business application backend (v2)
// The API server api/providers/dnb routes
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
import { getBoolQryParam, httpStatusOk, dcdrUtf8 } from '../../share/utils.js';
import appConsts from '../../share/appConsts.js';
import { createDunsRec } from '../../share/apiDefs.js';
import { B2bApiErr } from '../../share/b2bApiErr.js';
import db from '../../share/pg.js';

const router = express.Router();

router.get('/', (req, resp) => {
    resp.json( appConsts.providers.dnb )
});

router.get(`/duns/:key`, async (req, resp, next) => {
    try {
        //Instantiate a new Direct+ record with the DUNS key from the request parameters
        req.b2b = {
            rec: createDunsRec(req.params.key, req.query.product)
        };

        //Instantiate a B2B object on the response object
        resp.b2b = {};

        //If the forceNew query parameter is set (either as an empty string or the value 'true')
        //do not check the database for an existing record
        if(!getBoolQryParam(req.query.forceNew)) {
            resp.b2b.sqlSelect = await db.query( req.b2b.rec.sqlSelect, [req.b2b.rec.key] )
        };

        //If the DUNS record is found in the database, return it; otherwise, fetch it from the external API
        if( resp.b2b.sqlSelect && resp.b2b.sqlSelect.rows.length &&
            resp.b2b.sqlSelect.rows[0][`product_${req.b2b.rec.productNum}`] &&
            httpStatusOk(resp.b2b.sqlSelect.rows[0][`http_status_${req.b2b.rec.productNum}`]) )
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

        //Fetch the DUNS record from the external API
        resp.b2b.fetchResp = await fetch(req.b2b.rec.getFetchReqObj());

        //Timestamp the resonse
        resp.b2b.tsz = Date.now();

        //Log the response status time it took to get the response from the external API
        //console.log(`External API responded with status ${resp.b2b.fetchResp.status} for key ${req.b2b.rec.key} in ${resp.b2b.tsz - req.b2b.tsz} ms`);

        //Read the response body as an ArrayBuffer
        resp.b2b.arrBuff = await resp.b2b.fetchResp.arrayBuffer();

        //Decode the response body from the external API
        let sRespBody = dcdrUtf8.decode(resp.b2b.arrBuff);

        //Check if the external API responded with an HTTP error status
        if(!resp.b2b.fetchResp.ok) {
            throw new B2bApiErr(
                'extnlApiErr',
                `External API responded with an HTTP error status: ${resp.b2b.fetchResp.status}`,
                resp.b2b.fetchResp.status,
                sRespBody
            )
        }

        //Deal with pagination if necessary
        let iPageReq = parseInt(req.b2b?.rec?.qryParams?.['page[number]']);

        if(iPageReq) { //page[number] query parameter specified and != 0
            resp.b2b.dnbProdObj = JSON.parse(sRespBody);

            const urlPageLast = new URL(resp.b2b.dnbProdObj?.links?.last);

            if(urlPageLast?.searchParams?.size) {
                const iPageLast = parseInt(urlPageLast.searchParams.get('page[number]'));

                //console.log(`Fetched page ${iPageReq}, in total ${iPageLast} pages in the product`);

                while(iPageLast > iPageReq++) {
                    //console.log(`Fetching page ${iPageReq}`);

                    const nextFetchResp = await fetch(req.b2b.rec.getFetchReqObjNextPage(iPageReq));
                    const nextDnbProdObj = await nextFetchResp.json();

                    resp.b2b.dnbProdObj.familyTreeMembers.push( ...nextDnbProdObj.familyTreeMembers );
                }

                //console.log(`Total number of family members retrieved ${resp.b2b.dnbProdObj.familyTreeMembers.length}`);

                sRespBody = JSON.stringify(resp.b2b.dnbProdObj);
            }
        }

        //Set response headers
        resp.set({
            'Content-Type': 'application/json',
            'X-B2BV2-Cache': false,
            'X-B2BV2-Obtained-At': new Date(resp.b2b.tsz).toISOString(),
            'X-B2BV2-Extnl-API-Status': resp.b2b.fetchResp.status ,
            'X-B2BV2-Num-Pages': iPageReq && iPageReq > 1 ? iPageReq - 1 : 1
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
        if(err instanceof B2bApiErr) return next(err, req, resp);

        console.error(err.stack || err);

        next( new B2bApiErr('unexpected', `Unexpected error in /dnb/duns/${req.params.key}, ${err.message} (${err.cause})`) );
    }
});

export default router;
