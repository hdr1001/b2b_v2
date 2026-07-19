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

//Common attributes as they relate to providers of B2B APIs
const providers = {
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
            const url = this.getURL();

            if(this.extPath) url.pathname = urlJoin(url.pathname, this.extPath);
            if(this.key) url.pathname = urlJoin(url.pathname, this.key);
            if(this.qryParams) url.search = new URLSearchParams(this.qryParams).toString();

            return url;
        },

        getReqOpts: function() {
            const oOpts = {
                method: 'GET',
                headers: { ...this.headers }
            };

            oOpts.headers.Authorization = `Bearer ${process.env.DNB_DPL_TOKEN}`;

            return oOpts;
        },

        //Get the fetch request object for this provider
        getFetchReqObj: function() {
            return new Request(
                this.getReqURL(),
                this.getReqOpts()
            );
        },

        getFetchReqObjNextPage: function(iNextPage) {
            const url = this.getReqURL();

            url.searchParams.set('page[number]', iNextPage);

            return new Request(
                url,
                this.getReqOpts()
            );
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
};

//GLEIF level 1 product (the LEI record itself)
const gleifProduct0 = Object.create(providers.gleif); //Prototypal inheritance from the provider
gleifProduct0.idx = 0;
gleifProduct0.productNum = '00';

//GLEIF level 2 product (the direct parent of the LEI record)
const gleifProduct1 = Object.create(providers.gleif); //Prototypal inheritance from the provider
gleifProduct1.idx = 1;
gleifProduct1.productNum = '01';
gleifProduct1.singleton = 'direct-parent';

//D&B data blocks request
const dnbProduct0 = Object.create(providers.dnb); //Prototypal inheritance from the provider
dnbProduct0.idx = 0;
dnbProduct0.productNum = '00';
dnbProduct0.extPath = 'data/duns';
dnbProduct0.qryParams = {
    blockIDs: 'companyinfo_L2_v1,principalscontacts_L1_v2,hierarchyconnections_L1_v1'
};

const dnbProduct1 = Object.create(providers.dnb); //Prototypal inheritance from the provider
dnbProduct1.idx = 1;
dnbProduct1.productNum = '01';
dnbProduct1.extPath = 'data/duns';
dnbProduct1.qryParams = {
    blockIDs: 'financialstrengthinsight_L2_v1,paymentinsight_L1_v1',
    tradeUp: 'hq'
};

const dnbProduct2 = Object.create(providers.dnb); //Prototypal inheritance from the provider
dnbProduct2.idx = 2;
dnbProduct2.productNum = '02';
dnbProduct2.extPath = 'familyTree';
dnbProduct2.qryParams = {
    'page[size]': '1000',
    'page[number]': '1'
};

//Products made available by GLEIF
const gleifProducts = [
    gleifProduct0,
    gleifProduct1
];

//Products made available by D&B
const dnbProducts = [
    dnbProduct0,
    dnbProduct1,
    dnbProduct2
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
})

dnbProducts.forEach(prod => {
    prod.sqlSelect = sqlSelect.call(prod);
    prod.sqlUpsert = sqlUpsert.call(prod);
})

export default {
    providers,
    gleifProducts,
    dnbProducts
};
