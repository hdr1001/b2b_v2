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
import setupMainEventListeners from './evntListen.js';
import B2bReport from './js/components/b2bReport.js';
import B2bMultiStepID from './js/components/b2bMultiStepID.js';
import B2bAbout from './js/components/b2bAbout.js';

customElements.define('b2b-report', B2bReport);

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

//Set up event listeners for elements that are already present in the DOM
setupMainEventListeners();

//Add application components
function addApplicationComponents() {
    const appMain = document.querySelector('#app-main');

    //Instantiate a B2B report component & add it to the page
    const b2bReport = document.createElement('b2b-report');
    b2bReport.setAttribute('b2b-key', '56');
    appMain.appendChild(b2bReport);

    //Instantiate a about dialogcomponent & add it to the page
    const b2bAboutDialog = document.createElement('b2b-about');    
    appMain.appendChild(b2bAboutDialog);

    //Wait for the custom element to be registered before attaching the listener
    customElements.whenDefined('b2b-about').then(() => {
        document.querySelector('#nav-about').addEventListener('click', () => {
            // Ensure the method exists on the instance
            if (typeof b2bAboutDialog.showModal === 'function') {
                b2bAboutDialog.showModal();
            }
            else {
                console.error('showModal is not defined on <b2b-about>');
            }
        })
    });

    //Instantiate a multi step ID component & add it to the page
    const b2bMultiStepID = document.createElement('b2b-multi-step-id');
    appMain.appendChild(b2bMultiStepID);

    //Wait for the custom element to be registered before attaching the listener
    customElements.whenDefined('b2b-multi-step-id').then(() => {
        document.querySelector('#nav-search').addEventListener('click', () => {
            // Ensure the method exists on the instance
            if (typeof b2bMultiStepID.showModal === 'function') {
                b2bMultiStepID.showModal();
            }
            else {
                console.error('showModal is not defined on <b2b-multi-step-id>');
            }
        })
    });
}

//HTML document has been completely parsed
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');

    //If needed, fetch the ISO country data and store it in a Map for easy access
    if(!(isoCountries && isoCountries.size)) {
        fetchCountries()
            .then(countries => { 
                addApplicationComponents();
            })
            .catch(err => console.error('Error fetching ISO country data: ', err));
    }
    else {
        addApplicationComponents();
    }
});
