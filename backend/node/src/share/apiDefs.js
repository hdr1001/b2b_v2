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

export function createLeiRec(resource, product = 0) {
    //Validate the LEI key
    const lei = resource.trim();

    if(!appConsts.providers.gleif.validateKey(lei)) throw new B2bApiErr('invalidParameter', `Invalid LEI: ${lei}`);

    //Validate the product number
    const iProduct = parseInt(product, 10);

    if(isNaN(iProduct) || iProduct < 0 || iProduct >= appConsts.gleifProducts.length) {
        throw new B2bApiErr('invalidParameter', `Invalid product number ${product} for LEI record`);
    }

    //Return a new object inheriting from the specified product
    return Object.create(
        appConsts.gleifProducts[iProduct],
        {
            //Set resource as specified in the URL 
            resource: { value: resource },
            key: { value: lei },

            //Set product number
            product: { value: iProduct }
        }
    );
}

/*
export class LeiRec { //Get LEI record by ID
    constructor(resource, productNum = 0) {
        //Set product reference property
        switch(productNum) {
            case 0:
                this.product = appConsts.gleifProducts[0];
                break;
            case 1:
                this.product = appConsts.gleifProducts[1];
                break;
            default:
                throw new B2bApiErr('invalidParameter', `Invalid product number ${productNum} for LEI record`);
        }

        this.resource = resource;
        this.key = resource.trim();

        //Construct the request object for this API call
        this.fetchReqObj = this.product.getFetchReqObj.call(this);
    }

    //SQL statements for this LEI record
    get sqlSelect() { return this.product.sqlSelect }
    get sqlUpsert() { return this.product.sqlUpsert }

}
*/