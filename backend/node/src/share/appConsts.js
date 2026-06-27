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

const providers = {
    gleif: {
        name: 'gleif',
        key: 'lei',
        base: 'https://api.gleif.org',

        headers: {
            Accept: 'application/vnd.api+json'
        }
    }
};

const gleifProduct_00 = {
    provider: providers.gleif,
    product: 'product_00',
    path: '/api/v1/lei-records',

    getFetchReqObj: function() {
        const reqUrl = new URL(gleifProduct_00.path, providers.gleif.base);

        return new Request(
            reqUrl.href + (this.key ? `/${this.key}` : '/'),
            {
                method: 'GET',
                headers: providers.gleif.headers
            }
        );
    },

    sqlSelect: function() {
        return `SELECT ${gleifProduct00.provider.key}, ${gleifProduct00.product}, http_status_00, tsz_00 FROM products_${gleifProduct00.provider.name} WHERE ${gleifProduct00.provider.key} = `;
    }
};

export default {
    providers,
    gleifProduct_00
};
