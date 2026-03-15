/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Array of label/value(s) pairs class code for managing label/values   
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

import { Label } from "./lvsLabel.js";
import { ArrValues } from "./lvsArrValues.js";

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
            const th = this.lbl.domElem;

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
