/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Array of individual values class code for managing label/values   
//
// Copyright 2026 Hans de Rooij 
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ***************************************************************** */

import globals from '../globals.js';
import { IndivValue } from "./lvsIndvValue";

//Constructor function to instantiate an array of individual value object
export function ArrValues(values) {
    if(Array.isArray(values)) {
        //Parameter values is an array
        if(values.length > 0) {
            if(values.filter(elem => !(elem instanceof IndivValue)).length > 0) {
                this.arrIndvValues = values.map(elem => elem instanceof IndivValue ? elem : new IndivValue(elem))
            }
            else {
                this.arrIndvValues = values
            }
        }
        else this.arrIndvValues = values //Empty array
    }
    else { //Parameter values is not an array
        if(values instanceof IndivValue) {
            this.arrIndvValues = [ values ]
        }
        else {
            this.arrIndvValues = [ new IndivValue(values) ]
        }
    }

    //Remove any individual value objects with null, undefined or empty string values
    this.arrIndvValues = this.arrIndvValues.filter(indvValue => !(indvValue.toString() === ''));
}

//Shared value object functionality
Object.defineProperties(ArrValues.prototype, {
    toString: {
        value: function() { return this.arrIndvValues.map(indvValue => indvValue.toString()).join(globals.joinSep) }
    },
    numRows: {
        get: function() { return this.arrIndvValues.length }
    },
    domElems: {
        get: function() {
            let docFrag = new DocumentFragment, arrValues;

            this.arrIndvValues.forEach((indvValue, idx) => {
                const tr = docFrag.appendChild(document.createElement('tr'));

                if(idx === 0) tr.classList.add('first-row');
                if(idx === this.arrIndvValues.length - 1) tr.classList.add('last-row');

                const elem = indvValue.domElem;

                tr.appendChild(elem);

                docFrag.appendChild(tr);
            });
            
            return docFrag;
        }
    }
});
