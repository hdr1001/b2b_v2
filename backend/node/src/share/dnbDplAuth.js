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

function renewAdvised(expiresAt) {
    if(!expiresAt) return true;

    //Advise renewal if less than 96 minutes left
    return (expiresAt - Date.now()) < 5760000;
}

function updateEnvVars(token, expiresAt) {
    process.env.DNB_DPL_TOKEN = token;
    process.env.DNB_DPL_TOKEN_EXPIRES_AT = expiresAt;
}

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
        );

        //Object properties
        this.access_token = null;
        this.expiresAt = null;

        //Check whether the access token is still valid
        this.checkInterval = setInterval(this.getToken.bind(this), 1800000);
    }

    getToken = async function() {
        if(process.env.DNB_DPL_TOKEN) {
            const expiresAt = this.expiresAt || process.env.DNB_DPL_TOKEN_EXPIRES_AT;

            if(!renewAdvised(expiresAt)) {
                console.log('No D&B Direct+ token renewal needed 😊');

                return this.access_token || process.env.DNB_DPL_TOKEN;
            }
        }

        //Get a new token online
        try {
            //Make the D&B Direct+ API call
            const fetchAuthResp = await fetch(this.fetchReqObj.clone());
            const oAuth = await fetchAuthResp.json();

            //Update the object's attributes
            this.access_token = oAuth.access_token;
            this.expiresAt = new Date(Date.now() + oAuth.expires_in * 1000);

            updateEnvVars(this.access_token, this.expiresAt);

            console.log(`D&B Direct+ token ${this.access_token.substr(0, 3)}...`);

            return this.access_token;
        }
        catch(err) {
            console.error(err.message)
        }
    }
}

export default new DnbDplAuth;
