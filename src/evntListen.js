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

function setupEventListeners() {
    //HTML element references
    const appMain      = document.querySelector('#app-main');

    const navSearch    = document.querySelector('#nav-search');
    const navAbout     = document.querySelector('#nav-about');
    const navContact   = document.querySelector('#nav-contact');

    const dialogAbout  = document.querySelector('#dialog-about');
    const dialogSearch = document.querySelector('#dialog-search');
    const dialogSearchChoose = document.querySelector('#dialog-search-choose');

    //Navigation menu event listeners
    navSearch.addEventListener('click', () => dialogSearch.showModal());
    navAbout.addEventListener('click', () => dialogAbout.showModal());
    navContact.addEventListener('click', () => dialogSearchChoose.showModal());

    //Search dialog event listeners
    dialogSearch.addEventListener('click', event => { if(event.target === dialogSearch) dialogSearch.close() });  
    dialogSearch.querySelector('.icon-close').addEventListener('click', () => dialogSearch.close());

    //About dialog event listeners
    dialogAbout.addEventListener('click', event => { if(event.target === dialogAbout) dialogAbout.close() });
    dialogAbout.querySelector('.icon-close').addEventListener('click', () => dialogAbout.close());
}

export default setupEventListeners;
