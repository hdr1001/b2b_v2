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
        value: function(tag = 'td') {
            const elem = document.createElement(tag);
            elem.classList.add('label');
            elem.textContent = this.toString();

            return elem;
        }
    }
});

//Constructor function to instantiate a Value object
function Value(value) {
    this.value = value;
}

//Shared value object functionality
Object.defineProperties(Value.prototype, {
    toString: {
        value: function() { return String(nullUndefToEmptyStr(this.value)) }
    },
    isArray: {
        get: function() { return Array.isArray(this.value) }
    },
    numRows: {
        get: function() {
            return this.value == null ||  this.value === ''
                    ? 0
                    : (this.isArray ? this.value.length : 1)
        }
    },
    domElem: {
        value: function(tag = 'td') {
            const elem = document.createElement(tag);
            elem.textContent = this.toString();
            elem.classList.add('value');
            if(this.textContent === '') elem.classList.add('is-empty');

            return elem;
        }
    },
    domElems: {
        value: function(tag = 'td') {
            let docFrag = new DocumentFragment, arrValues;

            if(this.isArray) {
                if(this.value.length > 0) {
                    arrValues = this.value
                }
                else { //this.value is an empty array
                    arrValues = [ '' ]
                }
            }
            else { //this.value is not an array
                arrValues = [ this.value ]
            }

            arrValues.forEach((v, idx) => {
                const tr = docFrag.appendChild(document.createElement('tr'));
                if(idx === 0) tr.classList.add('first-row');
                if(idx === arrValues.length - 1) tr.classList.add('last-row');

                const elem = document.createElement(tag);
                elem.textContent = String(nullUndefToEmptyStr(v));
                elem.classList.add('value');
                if(elem.textContent === '') {
                    elem.classList.add('is-empty');
                    tr.classList.add('is-empty');
                }

                tr.appendChild(elem);
                docFrag.appendChild(tr);
            });
            
            return docFrag;
        }
    }
});

//Constructor function to instantiate a LabelValue object
export default function LabelValue(label, value) {
    this.lbl = new Label(label);
    this.val = new Value(value);
}

//Shared label/value pair functionality
Object.defineProperties(LabelValue.prototype, {
    toString: {
        value: function() { return String(this.val) ? `${this.lbl}: ${this.val}` : '' }
    },
    domElems: {
        get: function() {
            //A DocumentFragment containing one or more tr elements containing the data
            const docFrag = this.val.domElems('td');;

            //Get the data label as a th element
            const th = this.lbl.domElem('th')

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
