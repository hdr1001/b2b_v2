/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Label/value pairs are grouped in sections
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
import LabelValues from './labelValues.js';

//Constructor function to instantiate a report section
export default function RptSection(caption, lblVals) {
    if(!lblVals instanceof LabelValues) {
        throw new Error('The lblvals argument must be a LabelValues object');
    }

    this.caption = caption;
    this.lblVals = lblVals;
}

//Shared RptSection object functionality
Object.defineProperties(RptSection.prototype, {
    toString: {
        value: function() { return this.caption + globals.newLineSep + this.lblVals.toString() }
    },
    domElems: {
        get: function() {
            const docFrag = new DocumentFragment;

            //Wrapper div to help with styling and layout
            const div = document.createElement('div');
            div.classList.add('rpt-section-wrapper');

            docFrag.appendChild(div);

            //Create the main table element for the section
            const table = document.createElement('table');
            table.classList.add('rpt-section');

            div.appendChild(table);

            //Add the catoion as a caption element if it exists
            if(this.caption) {
                const tblCaption = document.createElement('caption');
                tblCaption.textContent = `${this.caption}`;

                table.appendChild(tblCaption)
            }

            const tbody = document.createElement('tbody');
            tbody.appendChild(this.lblVals.domElems);

            table.appendChild(tbody);

            return docFrag;
        }
    }
});
