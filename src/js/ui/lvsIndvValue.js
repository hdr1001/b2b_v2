/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Individual value class code for managing label/values   
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

//Constructor function for individual values
export function IndivValue(val, oOpts) {
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
