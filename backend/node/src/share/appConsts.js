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

import path from 'path';

//Common attributes as they relate to providers of B2B APIs
const providers = {
    gleif: {
        name: 'gleif',
        key: 'lei',
        base: 'https://api.gleif.org',

        headers: {
            Accept: 'application/vnd.api+json'
        },

        //Get the fetch request object for this provider
        getFetchReqObj: function() {
            let urlPath = this.path;

            if(this.key) urlPath = path.join(urlPath, this.key);
            if(this.singleton) urlPath = path.join(urlPath, this.singleton);

            const reqUrl = new URL(urlPath, this.provider.base);

            return new Request(
                reqUrl.href,
                {
                    method: 'GET',
                    headers: this.provider.headers
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
    }
};

//Products made available by GLEIF
const gleifProducts = [
    {
        //Provider reference
        provider: providers.gleif,

        //Product reference
        idx: 0, productNum: '00',

        //API path for this product
        path: '/api/v1/lei-records',

        //Get the fetch request object for a LEI record
        getFetchReqObj: function() { return this.provider.getFetchReqObj.call(this) },

        //Check the LEI passed in
        validateKey: function() { return this.provider.validateKey(this.key) }
    },
    {
        //Provider reference
        provider: providers.gleif,

        //Product reference
        idx: 1, productNum: '01',

        //API path for this product
        path: '/api/v1/lei-records',

        //Singleton
        singleton: 'direct-parent',

        //Get the fetch request object for a LEI record
        getFetchReqObj: function() { return this.provider.getFetchReqObj.call(this) },

        //Check the LEI passed in
        validateKey: function() { return this.provider.validateKey(this.key) }
    }
];

// SQL statements for the products
function sqlSelect() {
    return `SELECT ${this.provider.key}, product_${this.productNum}, http_status_${this.productNum}, tsz_${this.productNum} FROM products_${this.provider.name} WHERE ${this.provider.key} = $1;`
}

function sqlUpsert() {
    return `
        INSERT INTO products_${this.provider.name} 
            (${this.provider.key}, product_${this.productNum}, http_status_${this.productNum}, tsz_${this.productNum}) VALUES ($1, $2, $3, CURRENT_TIMESTAMP) 
        ON CONFLICT ( ${this.provider.key} )
            DO UPDATE SET product_${this.productNum} = $2, http_status_${this.productNum} = $3, tsz_${this.productNum} = CURRENT_TIMESTAMP;
    `
}

//Add the SQL statements to the product prototype
gleifProducts[0].sqlSelect = sqlSelect.call(gleifProducts[0]);
gleifProducts[0].sqlUpsert = sqlUpsert.call(gleifProducts[0]);
gleifProducts[1].sqlSelect = sqlSelect.call(gleifProducts[1]);
gleifProducts[1].sqlUpsert = sqlUpsert.call(gleifProducts[1]);

export default {
    providers,
    gleifProducts
};
