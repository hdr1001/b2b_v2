/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Application event listeners
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

import { LEIs } from './assets/data/LEIs.js';

export default function setupMainEventListeners() {
    function changeB2B_key() {
        let b2bKeyInterval = null;

        return () => {
            const b2bReport = document.querySelector('b2b-report');

            if(b2bReport && !b2bKeyInterval) {
                //Update the B2B report component every 5 seconds
                //with a different LEI record from the test data
                b2bKeyInterval = setInterval(() => {
                    let idx = +b2bReport.getAttribute('b2b-key') + 1;
                    if(idx > LEIs.length - 1) idx = 0;
                    b2bReport.setAttribute('b2b-key', idx);
                }, 5000);

                return;
            }

            if(b2bKeyInterval) clearInterval(b2bKeyInterval);
            b2bKeyInterval = null;
        };
    }

    //HTML element references
    const navContact = document.querySelector('#nav-contact');

    //Clicking the contact menu item will start/stop the automatic update of the B2B report component with different LEI records from the test data
    navContact.addEventListener('click', changeB2B_key());
}
