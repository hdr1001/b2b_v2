// *********************************************************************
//
// Business-to-business application backend (v2)
// The API request code
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

import { dcdrUtf8 } from './utils.js';
import appConsts from './appConsts.js';
import { B2bApiErr } from './b2bApiErr.js';

const apiKeyReq = (req, resp, next) => {
    //Execute the GLEIF API request
    return req.b2b.rec.execFetchReq()
        .then(fetchResp => {
            resp.b2b = { resp: fetchResp }

            return fetchResp.arrayBuffer();
        })
        .then(fetchArrBuff => {
            resp.b2b.arrBuff = fetchArrBuff;

            //Handle an HTTP error status returned by the GLEIF API
            if(resp.b2b.resp.status < 200 || resp.b2b.resp.status > 299) {
                const errMsg = `External API responded with an HTTP error status: ${resp.b2b.resp.status}`;
                console.error( errMsg );

                throw new B2bApiErr('extnlApiErr', errMsg, resp.b2b.resp.status, dcdrUtf8.decode(resp.b2b.arrBuff));
            }

            return fetchArrBuff;
        })
}

export default apiKeyReq;
