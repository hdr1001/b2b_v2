/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Component for specifying search criteria for a B2B search  
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

const cssB2bSearchCriteria = new URL('./css/b2bSearchCriteria.css', import.meta.url).href;

//A HTML5 B2B search criteria custom component class
export default class B2bSearchCriteria extends HTMLElement {
    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });

        this.iniValues = JSON.parse(this.getAttribute('ini-values') || '{}');
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //Create a link to the component's CSS file
        const css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssB2bSearchCriteria);

        this.shadowRoot.appendChild(css);

        //Create the component's HTML structure
        const b2bSearch = document.createElement('div');
        b2bSearch.id = 'b2b-search-criteria';

        const tempP = document.createElement('p');
        tempP.innerHTML = `Search criteria: ${this.iniValues.isoAlpha2}`;
        b2bSearch.appendChild(tempP);

        this.shadowRoot.appendChild(b2bSearch);
    }
}
