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

import { createElement, X } from 'lucide';

import B2bSearchCriteria from './b2bSearchCriteria.js';
import B2bPlzWait from './b2bPlzWait.js';

const cssB2bMultiStepID = new URL('./css/b2bMultiStepID.css', import.meta.url).href;

const DIALOG_TITLE = 'dialog-title';

const iniValues = {
    isoAlpha2: 'NL' //Please specify the country code in uppercase
};

//A HTML5 B2B multi-step identification custom component class
export default class B2bMultiStepID extends HTMLElement {
    #dialogMultStepID;

    //Event handling functions
    #dialogClose = evnt => { if(evnt.target === this.#dialogMultStepID) this.close() }
    #iconClose = () => this.close();

    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });

        //Create a link to the component's CSS file
        let css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssB2bMultiStepID);

        //Add link to the css file to the shadow DOM
        this.shadowRoot.appendChild(css);       
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //This component is a dialog, so create a dialog element in the shadow DOM tree
        this.#dialogMultStepID = document.createElement('dialog');
        this.#dialogMultStepID.id = 'dialog-mult-step-id';

        this.showModal = () => this.#dialogMultStepID.showModal();
        this.close = () => this.#dialogMultStepID.close();

        this.shadowRoot.appendChild(this.#dialogMultStepID);

        const searchTitle = document.createElement('div');

        //Set dialog title and add a close icon 
        searchTitle.id = DIALOG_TITLE;
        searchTitle.innerText = 'Specify search criteria';

        //The title bar also contains a close icon
        const iconClose = createElement(X);
        iconClose.classList.add('icon-close');
        searchTitle.appendChild(iconClose);

        this.#dialogMultStepID.appendChild(searchTitle);

        //Instantiate a B2B search criteria component and add it to the multi step dialog
        const searchCriteria = document.createElement('b2b-search-criteria');
        searchCriteria.setAttribute('ini-values', JSON.stringify(iniValues));
        this.#dialogMultStepID.appendChild(searchCriteria);

        //Instantiate a B2B please wait component and add it to the multi step dialog
        const plzWait = document.createElement('b2b-plz-wait');
        plzWait.style.display = 'none';
        this.#dialogMultStepID.appendChild(plzWait);

        //Add an event listener to close the dialog when clicking outside of it
        this.#dialogMultStepID.addEventListener('click', this.#dialogClose);

        //Add an event listener to the close icon to close the dialog
        iconClose.addEventListener('click', this.#iconClose);

        //Listen for custom events bubbling up
        this.addEventListener('submitSearchCriteria', evnt => {
            console.log('Caught custom event submitSearchCriteria: ', evnt.detail);
        });
    }

    disconnectedCallback() {
        //Remove the event listeners
        this.#dialogMultStepID.removeEventListener('click', this.#dialogClose);

        const iconClose = this.#dialogMultStepID.querySelector('.icon-close');
        if(iconClose) iconClose.removeEventListener('click', this.#iconClose);

        this.showModal = null;
        this.close = null;

        this.removeEventListener('submitSearchCriteria');
    }
}

customElements.define('b2b-multi-step-id', B2bMultiStepID);
