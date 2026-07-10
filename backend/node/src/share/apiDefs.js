// *********************************************************************
//
// Function returns a new object inheriting from the specified product,
// with the resource and key properties set
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
    //Validate the product number
    const iProduct = parseInt(product, 10);

    if(isNaN(iProduct) || iProduct < 0 || iProduct >= appConsts.gleifProducts.length) {
        throw new B2bApiErr('invalidParameter', `Invalid product number ${product} for LEI record`);
    }

    //Create a new object inheriting from the specified product
    const leiRec = Object.create(appConsts.gleifProducts[iProduct]);

    //Set product number property
    leiRec.product = iProduct;

    //Validate the LEI key
    leiRec.resource = resource;
    leiRec.key = resource.trim();

    if(!appConsts.providers.gleif.validateKey(leiRec.key)) throw new B2bApiErr('invalidParameter', `Invalid LEI: ${leiRec.key}`);

    //Return a new object inheriting from the specified product
    return leiRec;
}
