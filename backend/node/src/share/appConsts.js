// *********************************************************************
//
// Application constants for the B2B API server
// Providers, products, URLs, etc ...
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

import { join as urlJoin } from 'node:path/posix';
import { readFileSync } from 'node:fs';

//Common attributes as they relate to providers of B2B APIs
const providers = Object.freeze({
    gleif: {
        //API details for the GLEIF API
        name: 'gleif',
        key: 'lei',
        base: 'https://api.gleif.org',

        path: '/api/v1/lei-records',

        headers: {
            Accept: 'application/vnd.api+json'
        },

        getURL: function(){ return new URL(this.path, this.base) },

        //Get the fetch request object for this provider
        getFetchReqObj: function() {
            const url = this.getURL();

            if(this.key) url.pathname = urlJoin(url.pathname, this.key);
            if(this.singleton) url.pathname = urlJoin(url.pathname, this.singleton);

            return new Request(
                url.href,
                {
                    method: 'GET',
                    headers: this.headers
                }
            );
        },

        //Check the LEI passed in
        validateKey: function(lei) {
            let m = 0, charCode;

            //Check the internal consistency of the LEI
            for(let i = 0; i < lei.length; i++) {
                charCode = lei.charCodeAt(i);

                if(charCode >= 48 && charCode <= 57) {
                    m = (m * 10 + charCode - 48) % 97 
                }
                else if(charCode >= 65 && charCode <= 90) {
                    m = (m * 100 + charCode - 55) % 97 
                }
                else {
                    console.log(`Unexpected character at ${i}`);
                    return false;
                }
            }

            return m === 1;
        }
    },

    dnb: {
        //API details for the D&B API
        name: 'dnb', //For D&B, Dun & Bradstreet
        key: 'duns',
        base: 'https://plus.dnb.com',

        path: 'v1',

        headers: {
            'Content-Type': 'application/json'
        },

        getURL: function(){ return new URL(this.path, this.base) },

        getReqURL: function() {
            //url will be https://plus.dnb.com/v1
            const url = this.getURL();

            //url will be https://plus.dnb.com/v1/data/duns, https://plus.dnb.com/v1/familyTree, ...
            if(this.extPath) url.pathname = urlJoin(url.pathname, this.extPath);

            if(this.extPath !== 'match/cleanseMatch') { //cleanseMatch endpoint fully formed
                //Ownership Insights endpoints do not end in a resource 🙁
                if(this.extPath === 'beneficialowner') {
                    //url will be https://plus.dnb.com/v1/beneficialowner?duns=...
                    if(this.key) this.qryParams.duns = this.key;
                }
                //All other endpoints end in a resource 🙃
                else {
                    //https://plus.dnb.com/v1/data/duns/123456789
                    if(this.key) url.pathname = urlJoin(url.pathname, this.key);
                }
            }

            //https://plus.dnb.com/v1/data/duns/123456789?orderReason=6332&...
            if(this.qryParams) url.search = new URLSearchParams(this.qryParams).toString();

            return url;
        },

        getReqOpts: function() {
            const oOpts = {
                method: 'GET',
                headers: { ...this.headers }
            };

            oOpts.headers.Authorization = `Bearer ${dnbDplAuth.token}`;

            return oOpts;
        },

        //Get the fetch request object for this provider
        getFetchReqObj: function() {
            return new Request( this.getReqURL(), this.getReqOpts() )
        },

        getFetchReqObjNextPage: function(iNextPage) {
            const url = this.getReqURL();

            url.searchParams.set(this.qryParamPageNum, iNextPage);

            return new Request( url, this.getReqOpts() );
        },

        cleanDUNS: function (inDUNS) {
            //Return an empty string if input value is not a string or is empty
            if(typeof inDUNS !== 'string' || inDUNS.length === 0) {
                return '';
            }

            //Correct the old school XX-XXX-XXXX DUNS format
            let outDUNS = inDUNS.length === 11 && inDUNS.slice(2, 3) === '-' && inDUNS.slice(6, 7) === '-'
                ? inDUNS.slice(0, 2) + inDUNS.slice(3, 6) + inDUNS.slice(7)
                : inDUNS;

            //Return an empty string if key contains more than nine characters
            if(outDUNS.length > 9) return '';

            //Return the DUNS with, if needed, 0s prepended
            return '000000000'.slice(0, 9 - outDUNS.length) + outDUNS;
        }
    }
});

//GLEIF level 1 product (the LEI record itself)
const gleifProduct0 = Object.assign(
    Object.create(providers.gleif), //Prototypal inheritance from the provider
    { idx: 0, productNum: '00' }
); 

//GLEIF level 2 product (the direct parent of the LEI record)
const gleifProduct1 = Object.assign(
    Object.create(providers.gleif), //Prototypal inheritance from the provider
    { idx: 1, productNum: '01', singleton: 'direct-parent' }
); 

//D&B data blocks request
const dnbProduct0 = Object.assign(
    Object.create(providers.dnb), //Prototypal inheritance from the provider
    {
        idx: 0,
        productNum: '00',
        extPath: 'data/duns',
        qryParams: {
            blockIDs: 'companyinfo_L2_v1,principalscontacts_L1_v2,hierarchyconnections_L1_v1',
            orderReason: 6332
        }
    }
);

const dnbProduct1 = Object.assign(
    Object.create(providers.dnb), //Prototypal inheritance from the provider
    {
        idx: 1,
        productNum: '01',
        extPath: 'data/duns',
        qryParams: {
            blockIDs: 'financialstrengthinsight_L2_v1,paymentinsight_L1_v1',
            tradeUp: 'hq',
            orderReason: 6332
        }
    }
);

const dnbProduct2 = Object.assign(
    Object.create(providers.dnb), //Prototypal inheritance from the provider
    {
        idx: 2,
        productNum: '02',
        extPath: 'familyTree',
        qryParams: {
            'page[size]': '1000',
            'page[number]': '1'
        },
        qryParamPageNum: 'page[number]' //Paginated request
    }
);

const dnbProduct3 = Object.assign(
    Object.create(providers.dnb), //Prototypal inheritance from the provider
    {
        idx: 3,
        productNum: '03',
        extPath: 'beneficialowner',
        qryParams: {
            productId: 'cmpbol',
            versionId: 'v1',
            tradeUp: 'hq',
            returnPaginatedResults: true,
            pageNumber: 1
        },
        qryParamPageNum: 'pageNumber' //Paginated request
    }
);

const dnbIDentityResolution = Object.assign(
    Object.create(providers.dnb), //Prototypal inheritance from the provider
    {
        extPath: 'match/cleanseMatch',
    }
);

//Products made available by GLEIF
const gleifProducts = [
    gleifProduct0,
    gleifProduct1
];

//Products made available by D&B
const dnbProducts = [
    dnbProduct0,
    dnbProduct1,
    dnbProduct2,
    dnbProduct3
];

// SQL statements for the products
function sqlSelect() {
    return `SELECT ${this.key}, product_${this.productNum}, http_status_${this.productNum}, tsz_${this.productNum} FROM products_${this.name} WHERE ${this.key} = $1;`
}

function sqlUpsert() {
    return `
        INSERT INTO products_${this.name} 
            (${this.key}, product_${this.productNum}, http_status_${this.productNum}, tsz_${this.productNum}) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
        ON CONFLICT ( ${this.key} )
            DO UPDATE SET product_${this.productNum} = $2, http_status_${this.productNum} = $3, tsz_${this.productNum} = CURRENT_TIMESTAMP;
    `
}

//Add the SQL statements to the product prototype
gleifProducts.forEach(prod => {
    prod.sqlSelect = sqlSelect.call(prod);
    prod.sqlUpsert = sqlUpsert.call(prod);
    Object.freeze(prod);
})

dnbProducts.forEach(prod => {
    prod.sqlSelect = sqlSelect.call(prod);
    prod.sqlUpsert = sqlUpsert.call(prod);
    Object.freeze(prod);
})

class DnbDplAuth {
    #creds_key;
    #creds_secret;
    #token;
    #expiresAt;

    constructor() {
        this.#creds_key = process.env.DNB_DPL_KEY || readFileSync('/run/secrets/dnb_dpl_key', 'utf8').trim();
        this.#creds_secret = process.env.DNB_DPL_SECRET || readFileSync('/run/secrets/dnb_dpl_secret', 'utf8').trim();

        const bodyParams = new URLSearchParams();
        bodyParams.append('grant_type', 'client_credentials');

        this.fetchReqObj = new Request(
            new URL('v3/token', providers.dnb.base),
            {
                method: 'POST',
                headers: {
                    ...providers.dnb.headers,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization: `Basic ${Buffer.from(`${this.#creds_key}:${this.#creds_secret}`).toString('Base64')}`
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

    renewAdvised() {
        if(!this.#expiresAt) return true;

        //Advise renewal if less than 96 minutes left
        return (this.#expiresAt - Date.now()) < 5760000;
    }

    async getToken() {
        if(this.#token) {
            if(!this.renewAdvised()) {
                console.log('No D&B Direct+ token renewal needed 😊');

                return this.#token;
            }
        }

        //Get a new token online
        try {
            //Make the D&B Direct+ API call
            const fetchAuthResp = await fetch(this.fetchReqObj.clone());
            const oAuth = await fetchAuthResp.json();

            //Update the object's attributes
            this.#token = oAuth.access_token;
            this.#expiresAt = new Date(Date.now() + oAuth.expires_in * 1000);

            console.log(`D&B Direct+ token ${this.#token.substr(0, 3)}...`);

            return this.#token;
        }
        catch(err) {
            console.error(err.message)
        }
    }

    get token() {
        return this.#token;
    } 
}

const dnbDplAuth = new DnbDplAuth;

export {
    providers,
    gleifProducts,
    dnbProducts,
    dnbIDentityResolution,
    dnbDplAuth
};
