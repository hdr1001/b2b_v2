/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Application entry point and main application logic
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

import { isoCountries, fetchCountries } from './assets/codes/isoCountries.js';
import addDialogSearch from './js/ui/dialogSearch.js';
import addDialogAbout from './js/ui/dialogAbout.js';
import setupMainEventListeners from './evntListen.js';
import B2bReport from './js/components/b2bReport.js';
import B2bMultiStepID from './js/components/b2bMultiStepID.js';

customElements.define('b2b-report', B2bReport);
customElements.define('b2b-multi-step-id', B2bMultiStepID);

console.log('Top of main.js');

//Main application structure
document.querySelector('#app').innerHTML = `
  <header>
    <div class="app-name">B2B v2</div>
    <nav>
      <a href="javascript:void(0)">Home</a>
      <a href="javascript:void(0)" id="nav-search">Search</a>
      <a href="javascript:void(0)" id="nav-about">About</a>
      <a href="javascript:void(0)" id="nav-contact">Contact</a>
    </nav>
  </header>
  <main id="app-main"></main>
`;

//Add dialogs
const appMain = document.querySelector('#app-main');
appMain.appendChild(addDialogSearch());
appMain.appendChild(addDialogAbout());

//Instantiate a B2B report component and add it to the page
const b2bReport = document.createElement('b2b-report');
b2bReport.setAttribute('b2b-key', '56');
document.querySelector('#app-main').appendChild(b2bReport);

//HTML document has been completely parsed
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');

    //Set up event listeners for elements that are already present in the DOM
    setupMainEventListeners();

    //If needed, fetch the ISO country data and store it in a Map for easy access
    if(!(isoCountries && isoCountries.size)) fetchCountries();

    const b2bMultiStepID = document.createElement('b2b-multi-step-id');
    document.querySelector('#app-main').appendChild(b2bMultiStepID);

    // Wait for the custom element to be registered before attaching the listener
    customElements.whenDefined('b2b-multi-step-id').then(() => {
        document.querySelector('#nav-contact').addEventListener('click', () => {
            // Ensure the method exists on the instance
            if (typeof b2bMultiStepID.showModal === 'function') {
                b2bMultiStepID.showModal();
            }
            else {
                console.error('showModal is not defined on <b2b-multi-step-id>');
            }
        })
    });
});
