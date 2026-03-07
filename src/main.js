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

import setupEventListeners from './evntListen.js';
import CcLeiRec from './js/components/ccLeiRec.js';
import CcLeiRecTxt from './js/components/ccLeiRecTxt.js';
import { LEIs } from './assets/data/LEIs.js';
import LeiRec from './js/gleif/leiRec.js';
import LabelValue from './js/ui/labelValue.js';
import LabelValues from './js/ui/labelValues.js';
import RptSection from './js/ui/rptSection.js';

customElements.define('lei-rec', CcLeiRec);
customElements.define('lei-rec-txt', CcLeiRecTxt);

console.log('Top of main.js');

//Main application structure
document.querySelector('#app').innerHTML = `
  <header>
    <div class="app-name">B2B v2</div>
    <nav>
      <a href="javascript:void(0)">Home</a>
      <a href="javascript:void(0)" id="nav-about">About</a>
      <a href="javascript:void(0)" id="nav-contact">Contact</a>
    </nav>
  </header>
  <main id="app-main"></main>
`;

//The about dialog
document.querySelector('#app-main').innerHTML = `
  <dialog id="dialog-about">
    <div id="about-title">About B2B v2
      <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 12 12" class="icon icon-close">
        <path d="m2.25,10.5c-.192,0-.384-.073-.53-.22-.293-.293-.293-.768,0-1.061L9.22,1.72c.293-.293.768-.293,1.061,0s.293.768,0,1.061l-7.5,7.5c-.146.146-.338.22-.53.22Z" fill="currentColor" stroke-width="0" data-color="color-2"></path>
        <path d="m9.75,10.5c-.192,0-.384-.073-.53-.22L1.72,2.78c-.293-.293-.293-.768,0-1.061s.768-.293,1.061,0l7.5,7.5c.293.293.293.768,0,1.061-.146.146-.338.22-.53.22Z" stroke-width="0" fill="currentColor"></path>
      </svg>
    </div>
    <table>
      <tr><th>Application:</th><td>Business-to-business</td></tr>
      <tr><th>Version:</th><td>2.0.0</td></tr>
      <tr><th>Copyright:</th><td>&copy;2026 Hans de Rooij</td></tr>
      <tr><th>License:</th><td>Apache 2.0</td></tr>
    </table>
  </dialog>
`;

const leiRec = new LeiRec(LEIs[1]);

const lvs = new LabelValues([
    new LabelValue('LEI', leiRec.attribs?.lei),
    new LabelValue('Name', leiRec.entity.legalName.name),
    new LabelValue('Other name(s)', leiRec.entity.otherNames.map(elem => elem.name)),
    new LabelValue('Legal address', leiRec.entity.legalAddress.toArr())
]);

//const aLV = new LabelValue('LEI', leiRec.attribs?.lei);
//const aLV = new LabelValue('Name', leiRec.entity.legalName.name);
//const aLV = new LabelValue('Other name(s)', leiRec.entity.otherNames.map(elem => elem.name));

const rptSection = new RptSection('LEI record', lvs);

console.log(rptSection.toString());

document.querySelector('#app-main').appendChild(rptSection.domElems);

/*
const leiRecSection01 = document.createElement('lei-rec');
document.querySelector('#app-main').appendChild(leiRecSection01);
*/ /*
const leiRecSection01 = document.createElement('lei-rec-txt');
leiRecSection01.setAttribute('idx', '13');

const leiRecSection02 = document.createElement('lei-rec-txt');
leiRecSection02.setAttribute('idx', '3');

const leiRecSection03 = document.createElement('lei-rec-txt');
leiRecSection03.setAttribute('idx', '5');

//Add the custom components for the LEI records
document.querySelector('#app-main').appendChild(leiRecSection01);
document.querySelector('#app-main').appendChild(leiRecSection02);
document.querySelector('#app-main').appendChild(leiRecSection03);
*/
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM content loaded');

    setupEventListeners();
});
