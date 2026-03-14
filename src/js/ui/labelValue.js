/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Logic for structuring data in label/value pairs
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
import { nullUndefToEmptyStr } from '../utils.js';

//Constructor function to instantiate a Label object
function Label(desc) {
    this.desc = desc;
}

//Shared label object functionality
Object.defineProperties(Label.prototype, {
    toString: {
        value: function() { return String(this.desc) }
    },
    domElem: {
        value: function() {
            const elem = document.createElement('td');

            elem.classList.add('label');
            elem.textContent = this.toString();

            return elem;
        }
    }
});

//Constructor function for individual values
function IndivValue(val, oOpts) {
    this.value = val;
    if(oOpts) this.opts = oOpts;
}

//Shared individual value object functionality
Object.defineProperties(IndivValue.prototype, {
    toString: {
        value: function() { return String(nullUndefToEmptyStr(this.value)) }
    },
    domElem: {
        get: function() {
            const elem = document.createElement('td');

            elem.textContent = String(this.value);
            elem.classList.add('value');

            if(this.textContent === '') elem.classList.add('is-empty');

            if(this.opts && this.opts.addtlInfo) {
                elem.setAttribute('data-addtl-info', this.opts.addtlInfo);
            }

            return elem;
        }
    },
});

//Constructor function to instantiate an array of individual value object
function ArrValues(values) {
    if(Array.isArray(values)) {
        //Parameter values is an array
        if(values.length > 0) {
            if(values.includes(elem => !(elem instanceof IndivValue))) {
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

                //if(elem.querySelector('.is-empty')) tr.classList.add('value-is-empty');

                tr.appendChild(elem);

                docFrag.appendChild(tr);
            });
            
            return docFrag;
        }
    }
});

//Constructor function to instantiate a label and array of individual value objects
export default function LabelArrValues(label, values) {
    this.lbl = new Label(label);
    this.arrVals = new ArrValues(values);
}

//Shared label/value pair functionality
Object.defineProperties(LabelArrValues.prototype, {
    valueEmpty: {
        get: function() { return this.arrVals.length === 0 }
    },
    toString: {
        value: function() { return String(this.arrVals) ? `${this.lbl}: ${this.arrVals}` : '' }
    },
    domElems: {
        get: function() {
            //A DocumentFragment containing one or more tr elements containing the data
            const docFrag = this.arrVals.domElems;

            //Get the data label as a th element
            const th = this.lbl.domElem('th');

            //Make the header the first child of the first row element
            const firstRow = docFrag.firstChild;
            firstRow.insertBefore(th, firstRow.firstChild);

            //Add, if necessary, a rowspan attribute to the header cell
            if(docFrag.children.length > 1) {
                th.setAttribute('rowspan', docFrag.children.length);
            }

            return docFrag;
        }
    }
});
