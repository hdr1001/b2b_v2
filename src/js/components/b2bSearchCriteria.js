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
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //Get the initial values as contained in the 'ini-values' attribute
        this.iniValues = JSON.parse(this.getAttribute('ini-values') || '{}');

        //Create a link to the component's CSS file
        const css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssB2bSearchCriteria);

        this.shadowRoot.appendChild(css);

        //onclick event handler for text-input elements
        function hasNoneEmptyValue(evnt) {
            if(!evnt.currentTarget.value) {
                evnt.currentTarget.classList.remove(HAS_NONE_EMPTY_VALUE);
                return;
            }

            evnt.currentTarget.classList.add(HAS_NONE_EMPTY_VALUE);
        }

        //Function to create a label/(text-)input element pair
        function getInputElement(inpElem) {
            const docFrag = document.createDocumentFragment();

            const input = document.createElement('input');
            input.type = 'text';
            input.id = inpElem.id;
            input.name = inpElem.name;

            if(inpElem.value && inpElem.id !== 'search-country') {
                input.value = inpElem.value;
                input.classList.add(HAS_NONE_EMPTY_VALUE);
            }

            input.addEventListener('change', hasNoneEmptyValue);

            docFrag.appendChild(input);

            const formLabel = document.createElement('label');
            formLabel.htmlFor = inpElem.id;
            formLabel.textContent = inpElem.label;

            docFrag.appendChild(formLabel);

            return docFrag;
        }

        //Form related string constants
        const FORM_ROW = 'form-row';
        const INPUT_TXT = 'input-text';

        //The text-input elements which are part of the dialog
        const inpElems = new Map([
            ['search-isoAlpha2', {id: 'search-isoAlpha2', name: 'isoAlpha2', value: this.iniValues?.isoAlpha2, label: 'ISO'}],
            ['search-country', {id: 'search-country', name: 'country', value: this.iniValues?.country, label: 'Country'}],
            ['search-name', {id: 'search-name', name: 'name', value: this.iniValues?.name, label: 'Name'}],
            ['search-addr1', {id: 'search-addr1', name: 'addr1', value: this.iniValues?.addr1, label: 'Address 1'}],
            ['search-addr2', {id: 'search-addr2', name: 'addr2', value: this.iniValues?.addr2, label: 'Address 2'}],
            ['search-postal-code', {id: 'search-postal-code', name: 'postalCode', value: this.iniValues?.postalCode, label: 'Postal code'}],
            ['search-city', {id: 'search-city', name: 'city', value: this.iniValues?.city, label: 'City'}],
            ['search-reg-number', {id: 'search-reg-number', name: 'regNumber', value: this.iniValues?.regNumber, label: 'Registration number'}]
        ]);

        //References to specific form parts
        const b2bSearchCriteria = document.createElement('div');
        const searchCriteriaForm = document.createElement('form');

        //Create the component's HTML structure
        b2bSearchCriteria.id = 'top-search-criteria';
        b2bSearchCriteria.appendChild(searchCriteriaForm);

        //All input elements are laid out in rows
        const formRow = document.createElement('div');
        formRow.classList.add(FORM_ROW);

        //All input elements are created in a div with class html-input
        const inpText = document.createElement('div');
        inpText.classList.add(INPUT_TXT);

        //Create label/input elements for registration number
        let divFormRow = formRow.cloneNode();
        let divInpText = inpText.cloneNode();

        divInpText.appendChild(getInputElement(inpElems.get('search-reg-number')));
        divFormRow.appendChild(divInpText);
        searchCriteriaForm.appendChild(divFormRow);

        this.shadowRoot.appendChild(b2bSearchCriteria);
    }
}
