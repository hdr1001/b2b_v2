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
        //API details for the GLEIF API
        name: 'gleif',
        key: 'lei',
        base: 'https://api.gleif.org',

        path: '/api/v1/lei-records',

        headers: {
            Accept: 'application/vnd.api+json'
        },

        //Get the fetch request object for this provider
        getFetchReqObj: function() {
            let urlPath = this.path;

            if(this.key) urlPath = path.join(urlPath, this.key);
            if(this.singleton) urlPath = path.join(urlPath, this.singleton);

            const reqUrl = new URL(urlPath, this.base);

            return new Request(
                reqUrl.href,
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

//Products made available by GLEIF
const gleifProducts = [
    gleifProduct0,
    gleifProduct1
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
gleifProducts[0].sqlSelect = sqlSelect.call(gleifProducts[0]);
gleifProducts[0].sqlUpsert = sqlUpsert.call(gleifProducts[0]);
gleifProducts[1].sqlSelect = sqlSelect.call(gleifProducts[1]);
gleifProducts[1].sqlUpsert = sqlUpsert.call(gleifProducts[1]);

export default {
    providers,
    gleifProducts
};
