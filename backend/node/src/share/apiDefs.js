// *********************************************************************
//
// Custom error class for the B2B API server
// JavaScript code defining API requests
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

import { B2bApiErr } from './b2bApiErr.js';

const apiReqs = Object.freeze(
    new Map([
        [ 'gleif', {
            name: 'gleif',
            base: 'https://api.gleif.org',

            headers: {
                Accept: 'application/vnd.api+json'
            },

            leiRec: { //LEI record (https://bit.ly/45mRwbt)
                key: 'lei',
                path: '/api/v1/lei-records',

                getReq: function() {
                    const reqUrl = new URL(apiReqs.get('gleif').leiRec.path, apiReqs.get('gleif').base);

                    return new Request(
                        reqUrl.href + (this.resource ? `/${this.resource}` : ''),
                        {
                            method: 'GET',
                            headers: apiReqs.get('gleif').headers
                        }
                    );
                }
            }
        }]
    ])
);

class LeiRec { //Get LEI record by ID
    #resp = null; //Fetch response object, cached after request
 
    constructor(resource) {
        //API
        this.api = apiReqs.get('gleif').name;
        this.key = apiReqs.get('gleif').leiRec.key;

        //resource is the LEI code, e.g. '724500K5PTPSST86UQ23'
        this.resource = resource;

        //Construct the request object for this API call
        this.req = apiReqs.get('gleif').leiRec.getReq.call(this);
    }

    //Execute the API request and cache the response
    async execReq() {
        return new Promise( (resolve, reject) => 
            fetch(this.req)
                .then( resp => resolve( this.#resp = resp ) )
                .catch( err => reject(err) )
        )
    }

    //Get the response, executing the request if not already done
    get resp() {
        if(!this.#resp) {
            return this.execReq();
        }

        return Promise.resolve(this.#resp);
    }
}

export { 
    apiReqs,
    LeiRec
};
