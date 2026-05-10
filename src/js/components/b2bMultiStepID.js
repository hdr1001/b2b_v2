/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Component for multi-step business identification  
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

import B2bSearchCriteria from './b2bSearchCriteria.js';
import B2bPlzWait from './b2bPlzWait.js';

customElements.define('b2b-search-criteria', B2bSearchCriteria);
customElements.define('b2b-plz-wait', B2bPlzWait);

const cssB2bMultiStepID = new URL('./css/b2bMultiStepID.css', import.meta.url).href;

const iniValues = {
    isoAlpha2: 'NL' //Please specify the country code in uppercase
};

//A HTML5 B2B multi-step identification custom component class
export default class B2bMultiStepID extends HTMLElement {
    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });

        //This component is a dialog, so create a dialog element in the shadow DOM tree
        this.dialogMultStepID = document.createElement('dialog');
        this.dialogMultStepID.id = 'dialog-mult-step-id';

        this.showModal = () => this.dialogMultStepID.showModal();
        this.close = () => this.dialogMultStepID.close();

        this.shadowRoot.appendChild(this.dialogMultStepID);

        //Listen for custom events bubbling up
        this.addEventListener('submitSearchCriteria', evnt => {
            console.log('Caught custom event submitSearchCriteria: ', evnt.detail);
        });
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //Instantiate a B2B search criteria component and add it to the multi step dialog
        const searchCriteria = document.createElement('b2b-search-criteria');
        searchCriteria.setAttribute('ini-values', JSON.stringify(iniValues));
        this.dialogMultStepID.appendChild(searchCriteria);

        //Instantiate a B2B please wait component and add it to the multi step dialog
        const plzWait = document.createElement('b2b-plz-wait');
        plzWait.style.display = 'none';
        this.dialogMultStepID.appendChild(plzWait);
    }
}
