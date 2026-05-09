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

import  { createElement, X, Plus, Minus } from 'lucide';

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
        //Form related string constants
        const FORM_ROW = 'form-row';
        const MULT_ELEM = 'mult-elem';
        const INPUT_TXT = 'input-text';
        const ROW_ADDR2 = 'row-addr2';
        const HAS_NONE_EMPTY_VALUE = 'has-none-empty-value';

        //References to specific form parts
        const b2bSearchCriteria = document.createElement('div');
        const searchCriteriaForm = document.createElement('form');
        let inpName = null; //reference to the name input element, for setting focus after reset

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

        //Submit button click event
        function submitClick() {
            const searchCriteria = {};

            searchCriteriaForm.querySelectorAll('input').forEach(inp => { 
                if(inp.value) searchCriteria[inp.name] = inp.value;

                //todo
                //if(inp === inpCountry) searchCriteria.isoAlpha2 = inp.getAttribute(CTRY_ISO_ALPHA2);
            });

            searchCriteriaForm.dispatchEvent(
                new CustomEvent(
                    'submitSearchCriteria',
                    {
                        composed: true,
                        bubbles: true,
                        detail: searchCriteria
                    }
            ));
        }

        //Reset button click event
        function resetClick() {
            searchCriteriaForm.querySelectorAll('input').forEach(inp => {
                //todo
                //if(inp === inpCountry) {
                    inp.value = this.iniValues?.[inp.name] ? this.iniValues[inp.name] : '';
                    inp.dispatchEvent(new Event('change', { bubbles: false }));
                //}
            });

            if(inpName) inpName.focus();
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

        //Function to create a dialog button element
        function getButtonElement(id, name, label) {
            const button = document.createElement('button');

            button.id = id;
            button.name = name;
            button.type = 'button';

            button.textContent = label;

            return button;
        }

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

        //Create the component's HTML structure
        b2bSearchCriteria.id = 'top-search-criteria';
        b2bSearchCriteria.appendChild(searchCriteriaForm);

        //All input elements are laid out in rows
        const formRow = document.createElement('div');
        formRow.classList.add(FORM_ROW);

        //All input elements are created in a div with class html-input
        const inpText = document.createElement('div');
        inpText.classList.add(INPUT_TXT);

        //Create label/input elements for name criterium
        let divFormRow = formRow.cloneNode();
        let divInpText = inpText.cloneNode();

        divInpText.appendChild(getInputElement(inpElems.get('search-name')));

        inpName = divInpText.querySelector('#search-name'); //for set focus

        divFormRow.appendChild(divInpText);
        searchCriteriaForm.appendChild(divFormRow);

        //Create label/input elements for address 1
        divFormRow = formRow.cloneNode();
        divInpText = inpText.cloneNode();

        divInpText.appendChild(getInputElement(inpElems.get('search-addr1')));

        //Add a button to toggle the visibility of the address 2 element
        const inpBtn = document.createElement('button');
        inpBtn.type = 'button';
        inpBtn.appendChild(createElement(Plus));
        const minusIcon = createElement(Minus);
        minusIcon.classList.add('display-none');
        inpBtn.appendChild(minusIcon);
        
        inpBtn.addEventListener('click', evnt => {
            inpBtn.querySelectorAll('svg').forEach(svg => svg.classList.toggle('display-none'));

            const divAddr2 = searchCriteriaForm.querySelector(`#${ROW_ADDR2}`);

            if(divAddr2) {
                const bHidden = divAddr2.classList.toggle('display-none');

                if(bHidden) {
                    divAddr2.querySelector('input').value = '';
                }
                else {
                    divAddr2.querySelector('input').focus();
                }
            }
        });

        divInpText.insertBefore(inpBtn, divInpText.lastChild);
        divFormRow.appendChild(divInpText);
        searchCriteriaForm.appendChild(divFormRow);

        //Create label/input elements for address 2
        divFormRow = formRow.cloneNode();
        divFormRow.id = ROW_ADDR2;
        divFormRow.classList.add('display-none');

        divInpText = inpText.cloneNode();
        divInpText.appendChild(getInputElement(inpElems.get('search-addr2')));

        divFormRow.appendChild(divInpText);
        searchCriteriaForm.appendChild(divFormRow);

        //Create label/input elements for postal code and city on the same row
        divFormRow = formRow.cloneNode();
        divFormRow.classList.add(MULT_ELEM);

        divInpText = inpText.cloneNode();
        divInpText.style.flex = '4'; //div takes op 40% of the row's width

        divInpText.appendChild(getInputElement(inpElems.get('search-postal-code')));
        divFormRow.appendChild(divInpText);

        divInpText = inpText.cloneNode();
        divInpText.style.flex = '6'; //div takes op 40% of the row's width

        divInpText.appendChild(getInputElement(inpElems.get('search-city')));

        divFormRow.appendChild(divInpText);
        searchCriteriaForm.appendChild(divFormRow);

        //Create label/input elements for registration number
        divFormRow = formRow.cloneNode();
        divInpText = inpText.cloneNode();

        divInpText.appendChild(getInputElement(inpElems.get('search-reg-number')));
        divFormRow.appendChild(divInpText);
        searchCriteriaForm.appendChild(divFormRow);

        //The last row in the form contains buttons
        divFormRow = formRow.cloneNode();
        divFormRow.classList.add('submit-reset');

        let button = getButtonElement('search-submit', 'submit', 'Submit');

        button.addEventListener('click', submitClick);

        divFormRow.appendChild(button);

        button = getButtonElement('search-reset', 'reset', 'Reset');

        button.addEventListener('click', resetClick);

        divFormRow.appendChild(button);

        searchCriteriaForm.appendChild(divFormRow);

        this.shadowRoot.appendChild(b2bSearchCriteria);
    }
}
