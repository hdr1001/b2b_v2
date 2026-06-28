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

import qry from './pg.js';
import appConsts from './appConsts.js';
import { B2bApiErr } from './b2bApiErr.js';

export class LeiRec { //Get LEI record by ID
    constructor(resource) {
        //Product reference
        this.product = appConsts.gleifProduct_00;

        this.resource = resource;
        this.key = resource.trim();

        //Construct the request object for this API call
        this.fetchReqObj = this.product.getFetchReqObj.call(this);
    }

    //Execute a SQL SELECT to (try to) retrieve the product from the database
/*    async execSelect() {
        return new Promise( (resolve, reject) => {
            qry(this.execSelect + this.key)
                .then( db => {
                    if(db.rows?.length) {
                        this.#resp = db.rows[0].product_00
                    }

                    resolve( this.#resp );
                })
                .catch( err => reject( new B2bApiErr('extnlApiErr', err.message + ', ' + err.cause || 'Error occurred while selecting LEI data') ) )
        })
    }
*/

    //Check the LEI passed in
    validateKey() {
        let m = 0, charCode;

        //Check the internal consistency of the LEI
        for(let i = 0; i < this.key.length; i++) {
            charCode = this.key.charCodeAt(i);

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
