// *********************************************************************
//
// Class for D&B Direct+ authorization
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

import appConsts from './appConsts.js';

class DnbDplAuth {
    constructor() {
        const bodyParams = new URLSearchParams();
        bodyParams.append('grant_type', 'client_credentials');

        this.fetchReqObj = new Request(
            new URL('v3/token', appConsts.providers.dnb.base),
            {
                method: 'POST',
                headers: {
                    ...appConsts.providers.dnb.headers,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${process.env.DNB_DPL_KEY}:${process.env.DNB_DPL_SECRET}`).toString('Base64')}`
                },
                body: bodyParams.toString()
            }
        )
    }

    getToken = async function() {
        return fetch(this.fetchReqObj)
    }
}

export default new DnbDplAuth;
