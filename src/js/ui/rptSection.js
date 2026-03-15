/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Report section made up of (multiple) label/values pairs 
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
import LabelArrValues from './lvsLabelArrValues.js';

//Constructor function to instantiate a report section
export default function RptSection(caption, arrLblArrVals) {
    if(!Array.isArray(arrLblArrVals)) {
        if((arrLblArrVals instanceof LabelArrValues)) {
            this.arrLblArrVals = [ arrLblArrVals ]
        }
        else {
            throw new Error('The arrLblArrVals argument must be an array of LabelArrValues objects');
        }
    }
    else {
        if(arrLblArrVals.filter(lav => !(lav instanceof LabelArrValues)).length > 0) {
            throw new Error('The arrLblArrVals argument must be an array of LabelArrValues objects');
        }
        else {
            this.arrLblArrVals = arrLblArrVals;
        }
    }

    this.caption = caption;
}

//Shared RptSection object functionality
Object.defineProperties(RptSection.prototype, {
    toString: {
        value: function() { return this.caption + globals.newLineSep + this.arrLblArrVals.join(globals.newLineSep) }
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
            this.arrLblArrVals.forEach(lblArrVal => tbody.appendChild(lblArrVal.domElems));

            table.appendChild(tbody);

            return docFrag;
        }
    }
});
