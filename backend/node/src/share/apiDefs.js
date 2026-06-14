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

const apiReqs = {
    gleif: {
        base: 'https://api.gleif.org',

        headers: {
            Accept: 'application/vnd.api+json'
        },

        leiRec: { //LEI record (https://bit.ly/45mRwbt)
            path: '/api/v1/lei-records',

            getReq: function() {
                const reqUrl = new URL(apiReqs.gleif.leiRec.path, apiReqs.gleif.base);

                return new Request(
                    reqUrl.href + (this.resource ? `/${this.resource}` : ''),
                    {
                        method: 'GET',
                        headers: apiReqs.gleif.headers
                    }
                );
            }
        }
    }
};

class LeiRec { //Get LEI record by ID
    #resp = null;
 
    constructor(resource) {
        this.resource = resource;
        this.req = apiReqs.gleif.leiRec.getReq.call(this);
    }

    get resp() {
        if(!this.#resp) {
            return new Promise( (resolve, reject) => {
                fetch(this.req)
                    .then( resp => resolve( this.#resp = resp ) )
                    .catch( err => reject(err) )
            });
        }

        return Promise.resolve(this.#resp);
    }
}

export { 
    LeiRec
};
