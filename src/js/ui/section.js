/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Data label/value pairs are grouped in sections
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

//A report section consists of a number of label/value pairs
function SectionTable(caption) {
    this.caption = caption;
}

//Return a DOM element representing the section as a table,
//or null if the section contains no label/value pairs
Object.defineProperty(SectionTable.prototype, 'domElem', {
    get: function() {
        //Create the main table element for the section
        const table = document.createElement('table');

        const caption = document.createElement('caption');
        caption.textContent = `${this.caption}`;

        table.appendChild(caption)

        return table;
    }
});

export { SectionTable };
