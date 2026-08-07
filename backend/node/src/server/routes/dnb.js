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
import { providers } from '../../share/appConsts.js';
import { createDunsRec, createDnbIDR } from '../../share/apiDefs.js';
import { B2bApiErr } from '../../share/b2bApiErr.js';
import db from '../../share/pg.js';

const router = express.Router();

//D&B products can be paginated
async function getPaginatedResp(req, resp, sRespBody, iPageReq) {
    //Convert the API response to an product object
    resp.b2b.dnbProdObj = JSON.parse(sRespBody);

    //Get the last property of the links section (a URLencoded string)
    const sLinkLast = resp.b2b.dnbProdObj?.links?.last;

    //Get the URL of the last page from the links object
    const urlPageLast = sLinkLast ? new URL(sLinkLast) : null;

    //The page number is embedded in a URL search parameter
    if(urlPageLast?.searchParams?.size) {
        //Must be possible to convert the last page to an integer
        const iPageLast = parseInt(urlPageLast.searchParams.get(req.b2b.rec.qryParamPageNum));

        console.log(`Fetched page ${iPageReq}, in total ${iPageLast} pages in the product`);

        //Only fetch additional pages if needed
        while(iPageLast > iPageReq) {
            iPageReq++; console.log(`Now fetching page ${iPageReq}`);

            //The actual fetch logic
            const nextFetchResp = await fetch(req.b2b.rec.getFetchReqObjNextPage(iPageReq));

            //Check if the external API responded with an HTTP error status
            if(!nextFetchResp.ok) {
                const buffErrResp = await nextFetchResp.arrayBuffer();

                throw new B2bApiErr(
                    'extnlApiErr',
                    `External API responded with an HTTP error status: ${nextFetchResp.status}`,
                    nextFetchResp.status,
                    dcdrUtf8.decode(buffErrResp)
                );
            }

            const nextDnbProdObj = await nextFetchResp.json();

            //Append the additional array elements
            if(req.b2b.rec.extPath === 'familyTree') {
                resp.b2b.dnbProdObj.familyTreeMembers.push( ...nextDnbProdObj.familyTreeMembers );
            }

            if(req.b2b.rec.extPath === 'beneficialowner') {
                resp.b2b.dnbProdObj.organization.beneficialOwnership.beneficialOwners.push( ...nextDnbProdObj.organization.beneficialOwnership.beneficialOwners );
            }
        }

        const numElems = resp.b2b.dnbProdObj.familyTreeMembers?.length || resp.b2b.dnbProdObj.organization?.beneficialOwnership?.beneficialOwners?.length;

        console.log(`Total number of array elements retrieved ${numElems}`);
    }

    resp.b2b.numPagesFetched = iPageReq;

    return (resp.b2b.numPagesFetched > 1) ? JSON.stringify(resp.b2b.dnbProdObj) : sRespBody;
}

router.get('/', (req, resp) => {
    resp.json( providers.dnb )
});

router.post(`/idr`, async (req, resp, next) => {
    try {
        //Instantiate a new Direct+ record with the DUNS key from the request parameters
        req.b2b = {
            rec: createDnbIDR(req.body)
        };

        //Instantiate a B2B object on the response object
        resp.b2b = {};

        //Timestamp the request
        req.b2b.tsz = Date.now();

        //Fetch the DUNS record from the external API
        resp.b2b.fetchResp = await fetch(req.b2b.rec.getFetchReqObj());

        //Timestamp the resonse
        resp.b2b.tsz = Date.now();

        //Log the response status time it took to get the response from the external API
        //console.log(`External API responded with status ${resp.b2b.fetchResp.status} in ${resp.b2b.tsz - req.b2b.tsz} ms`);

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

        //Update the database with the IDR record, straight-up insert
        const sqlInsert = await db.query( req.b2b.rec.sqlInsert, [ req.b2b.rec.qryParams, sRespBody, resp.b2b.fetchResp.status ] );

        if(sqlInsert.rowCount !== 1) {
            console.error(`Unexpected rowCount from SQL insert. Expected 1, got ${sqlInsert.rowCount}`);
        }
        
        //Get the ID of the inserted row
        const insID = sqlInsert.rows && sqlInsert.rows[0] && sqlInsert.rows[0].id;

        //Set response headers
        resp.set({
            'Content-Type': 'application/json',
            'X-B2BV2-Obtained-At': new Date(resp.b2b.tsz).toISOString(),
            'X-B2BV2-Extnl-API-Status': resp.b2b.fetchResp.status,
            'X-B2BV2-IDR-Row-ID': insID
        });

        //Return the response body to the client and upsert it into the database
        resp.send(sRespBody);
    }
    catch(err) {
        if(err instanceof B2bApiErr) return next(err, req, resp);

        console.error(err.stack || err);

        next( new B2bApiErr('unexpected', `Unexpected error in /dnb/idr, ${err.message} (${err.cause})`) );
    }
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

        //Some products might be paginated
        if(req.b2b.rec.qryParamPageNum) { //Paginated request (or, at least, could be)
            const iPageReq = parseInt(req.b2b.rec?.qryParams?.[req.b2b.rec.qryParamPageNum]);

            if(iPageReq === 1) {
                sRespBody = await getPaginatedResp(req, resp, sRespBody, iPageReq)
            }
            else {
                console.error('Pagination only works if value page number parameter is initially set to 1!')
            }
        }

        //Set response headers
        resp.set({
            'Content-Type': 'application/json',
            'X-B2BV2-Cache': false,
            'X-B2BV2-Obtained-At': new Date(resp.b2b.tsz).toISOString(),
            'X-B2BV2-Extnl-API-Status': resp.b2b.fetchResp.status,
            'X-B2BV2-Num-Pages': resp.b2b.numPagesFetched ? resp.b2b.numPagesFetched : 1
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
