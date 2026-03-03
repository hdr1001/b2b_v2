/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Structure for working with one or more label/value pairs
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

//Constructor function to instantiate a Label object
export default function LabelValues(arrLabelValues) {
    if(!Array.isArray(arrLabelValues)) {
        throw new Error('The argument should be an array of LabelValue objects');
    }

    this.labelValues = arrLabelValues;
}

//Shared LabelValues object functionality
Object.defineProperties(LabelValues.prototype, {
    toString: {
        value: function() { return this.labelValues.map(lv => lv.toString()).join('\n') }
    },
    domElems: {
        value: function(tag = 'td') { return this.labelValues.map(lv => lv.domElems(tag)) }
    }
});

