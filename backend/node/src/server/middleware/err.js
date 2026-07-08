// *********************************************************************
//
// Business-to-business application backend (v2)
// The API server middleware for error handling
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

import { B2bApiErr } from '../../share/b2bApiErr.js';
import db from '../../share/pg.js';

const errHandler = async (err, req, resp, next) => {
    let errMsg = 'Error occurred processing a request';
    errMsg = err.message || errMsg;

    if(err instanceof B2bApiErr) {
        if(err.addtlMessage) errMsg += ` (${err.addtlMessage})`;
    }

    console.error(errMsg);

    const reportedHttpStatus = err.extnlApi?.httpStatus || err.b2bErr?.httpStatus?.code || 500;

    resp.status( reportedHttpStatus ).json( err );

    // Log the error to the database
    const sSql = `INSERT INTO public.b2bv2_errs (err_msg, req_rec, b2b_err, extnl_http_status, reported_http_status) VALUES ($1, $2, $3, $4, $5)`;

    await db.query(
        sSql,
        [
            errMsg,
            req.b2b?.rec || { path: req.path },
            err,
            resp.b2b?.fetchResp?.status,
            reportedHttpStatus
        ]
    );
};

export default errHandler;
