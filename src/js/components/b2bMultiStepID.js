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
import B2bSelectCand from './b2bSelectCand.js';

const cssB2bMultiStepID = new URL('./css/b2bMultiStepID.css', import.meta.url).href;

const iniValues = {
    isoAlpha2: 'NL' //Please specify the country code in uppercase
};

//Get a reference to the first text node
const getFirstTextNode = elem => {
    const arrTextNodes = [...elem.childNodes] // has childNodes inside, including text ones
        .filter(child => child.nodeType === 3) // get only text nodes
        .filter(child => child.textContent.trim()); // eliminate empty text

    return arrTextNodes?.[0] || null; // return the first text node or null if there are none
};

//A HTML5 B2B multi-step identification custom component class
export default class B2bMultiStepID extends HTMLElement {
    #dialogMultStepID;

    #dialogTitle = null;
    #dialogSteps = new Map([
        ['searchCriteria', { component: null, dialogTitle: 'Specify search criteria' }],
        ['plzWait', { component: null, dialogTitle: 'One moment please ...' }],
        ['selectCandidate', { component: null, dialogTitle: 'Select the correct entity' }]
    ]);
    #currentStep = 'searchCriteria';

    #searchCriteria = null;

    //Event handling functions
    #dialogClose = evnt => { if(evnt.target === this.#dialogMultStepID) this.close() }
    #iconClose = () => this.close();
    #dialogOnToggle = () => { //Handler will be invoked on dialog open and close
        if(this.#dialogMultStepID.open) {
            if(this.#currentStep === 'searchCriteria') {
                const criteriaComponent = this.#dialogSteps.get('searchCriteria').component;

                if(criteriaComponent) {
                    if(criteriaComponent.validCountrySelected()) {
                        criteriaComponent.setFocusOnName()
                    }
                }
            }
        }
        else { //Dialog was closed
            this.#changeCurrentStepFromTo(this.#currentStep, 'searchCriteria');
            this.#dialogSteps.get('searchCriteria').component.extReset();
        }
    }

    //Change the active step in the multi-step dialog
    #changeCurrentStepFromTo = (fromStep, toStep) => {
        if(fromStep === toStep) return;

        //Diplay the component of the new step and hide the component of the previous step
        this.#dialogSteps.forEach((step, key) => {
            if(step.component) step.component.style.display = key === toStep ? 'block' : 'none';
        });

        //Change the dialog title to the title of the new step
        const elemTextTitle = getFirstTextNode(this.#dialogTitle);
        if(elemTextTitle) {
            elemTextTitle.textContent = this.#dialogSteps.get(toStep).dialogTitle;
        }

        //Set the new step as the current step
        this.#currentStep = toStep;

        if(this.#currentStep === 'plzWait') {
            const urlGleif = `https://api.gleif.org/api/v1/lei-records?filter[entity.registeredAs]=${this.#searchCriteria?.regNumber}&filter[entity.legalAddress.country]=${this.#searchCriteria?.isoAlpha2}`;
        
            return fetch(urlGleif)
                .then(resp => resp.text())
                .then(json => {
                    this.#dialogSteps.get('selectCandidate').component.setAttribute('json-lei-cands', json);
                    this.#changeCurrentStepFromTo('plzWait', 'selectCandidate')
                })
                .catch(err => console.error('Error fetching Gleif data: ', err));            
        }
    }

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

        //Set dialog title and add a close icon
        this.#dialogTitle = document.createElement('div');
        this.#dialogTitle.id = 'dialog-title';

        let dialogStep = this.#dialogSteps.get(this.#currentStep);

        //Title bar contains title text
        this.#dialogTitle.appendChild(document.createTextNode(dialogStep.dialogTitle));

        //The title bar also contains a close icon
        const iconClose = createElement(X);
        iconClose.classList.add('icon-close');

        this.#dialogTitle.appendChild(iconClose);
        this.#dialogMultStepID.appendChild(this.#dialogTitle);

        //Instantiate a B2B search criteria component and add it to the multi step dialog
        dialogStep.component = document.createElement('b2b-search-criteria');
        dialogStep.component.setAttribute('ini-values', JSON.stringify(iniValues));

        this.#dialogMultStepID.appendChild(dialogStep.component);

        //Instantiate a B2B please wait component and add it to the multi step dialog
        dialogStep = this.#dialogSteps.get('plzWait');
        dialogStep.component = document.createElement('b2b-plz-wait');
        dialogStep.component.style.display = 'none';

        this.#dialogMultStepID.appendChild(dialogStep.component);

        //Instantiate a B2B select candidate component and add it to the dialog
        dialogStep = this.#dialogSteps.get('selectCandidate');
        dialogStep.component = document.createElement('b2b-select-candidate');
        dialogStep.component.style.display = 'none';

        this.#dialogMultStepID.appendChild(dialogStep.component);

        //Add an event listener to the close icon to close the dialog
        iconClose.addEventListener('click', this.#iconClose);

        //Add an event listener to close the dialog when clicking outside of it
        this.#dialogMultStepID.addEventListener('click', this.#dialogClose);

        //Add an event listeners to dialog open/close events
        this.#dialogMultStepID.addEventListener('toggle', this.#dialogOnToggle);

        //Listen for custom events bubbling up
        this.addEventListener('submitSearchCriteria', evnt => {
            this.#searchCriteria = evnt.detail;

            this.#changeCurrentStepFromTo('searchCriteria', 'plzWait');
        });
    }

    disconnectedCallback() {
        //Remove the event listeners
        this.#dialogMultStepID.removeEventListener('click', this.#dialogClose);

        this.#dialogMultStepID.removeEventListener('toggle', this.#dialogOnToggle);

        const iconClose = this.#dialogMultStepID.querySelector('.icon-close');
        if(iconClose) iconClose.removeEventListener('click', this.#iconClose);

        this.showModal = null;
        this.close = null;

        this.removeEventListener('submitSearchCriteria');
    }
}

customElements.define('b2b-multi-step-id', B2bMultiStepID);
