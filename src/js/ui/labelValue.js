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
            elem.classList.add('value');
            elem.textContent = this.toString();

            return elem;
        }
    },
    domElems: {
        value: function(tag = 'td') {
            if(!this.isArray) return [ this.domElem(tag) ];

            let arrElems = [], elem;

            this.value.forEach( v => {
                elem = document.createElement(tag);
                elem.classList.add('value');
                elem.textContent = String(v);

                arrElems.push(elem);
            });
            
            return arrElems;
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
            const construct_trs = () => {
                let tr = document.createElement('tr');

                //Add the label as a table header cell
                const th = tr.appendChild(this.lbl.domElem('th'));

                //An array of table row elements to be returned
                const arr_trs = [];

                //Add the value(s) as table data cell(s)
                this.val.domElems('td').forEach((de, idx) => {
                    if(idx === 0) {
                        //If the value consists of multiple rows, make the label cell span those rows
                        if(this.val.numRows > 1) th.setAttribute('rowspan', String(this.val.numRows))
                    }
                    else {
                        tr = document.createElement('tr');
                    }

                    //Add a value as a table data cell
                    tr.appendChild(de);

                    //Return an array of table rows
                    arr_trs[idx] = tr;
                });

                return arr_trs;
            }

            return this.val ? construct_trs() : null;
        }
    }
});
