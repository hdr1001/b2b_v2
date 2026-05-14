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

import { createElement, X, Plus, Minus } from 'lucide';
import { isoCountries } from '../../assets/codes/isoCountries.js';

const cssB2bSearchCriteria = new URL('./css/b2bSearchCriteria.css', import.meta.url).href;
const cssFlagIcons = new URL('/node_modules/flag-icons/css/flag-icons.min.css', import.meta.url).href;

const CTRY_DATA_LIST = 'countries-data-list';
const CTRY_ISO_ALPHA2 = 'data-iso-alpha2';
const HAS_NONE_EMPTY_VALUE = 'has-none-empty-value';

//A HTML5 B2B search criteria custom component class
export default class B2bSearchCriteria extends HTMLElement {
    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });

        //Create a link to the component's CSS file
        let css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssB2bSearchCriteria);

        //Add link to the lipis flags to the shadow DOM
        this.shadowRoot.appendChild(css);

        css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssFlagIcons);

        this.shadowRoot.appendChild(css);

        //Build the datalist for the country input element
        const dataList = document.createElement('datalist');
        dataList.id = CTRY_DATA_LIST;

        const docFrag = new DocumentFragment;

        isoCountries.forEach(elem => {
            const opt = docFrag.appendChild(document.createElement('option'));

            opt.value = elem.name;
            opt.setAttribute(CTRY_ISO_ALPHA2, elem.alpha2);
        });

        dataList.appendChild(docFrag);
        this.shadowRoot.appendChild(dataList);
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //Form related string constants
        const FORM_ROW = 'form-row';
        const MULT_ELEM = 'mult-elem';
        const INPUT_TXT = 'input-text';
        const FLAG_ICON = 'flag-icon';
        const ROW_ADDR2 = 'row-addr2';

        //References to specific form parts
        const dataList = this.shadowRoot.querySelector(`#${CTRY_DATA_LIST}`);
        const b2bSearchCriteria = document.createElement('div');
        const searchCriteriaForm = document.createElement('form');
        const divFlag = document.createElement('div');
        let inpCountry = null; //Will be associated with the country text input
        let inpName = null; //reference to the name input element, for setting focus after reset

        //Get the initial values as contained in the 'ini-values' attribute
        this.iniValues = JSON.parse(this.getAttribute('ini-values') || '{}');

        //onclick event handler for text-input elements
        function hasNoneEmptyValue(evnt) {
            if(!evnt.currentTarget.value) {
                evnt.currentTarget.classList.remove(HAS_NONE_EMPTY_VALUE);
                return;
            }

            evnt.currentTarget.classList.add(HAS_NONE_EMPTY_VALUE);
        }

        //Create a span to hold the https://flagicons.lipis.dev/ flags
        function flagSpan(isoAlpha2) {
            if(isoAlpha2) {
                return `<span data-iso-alpha2="${isoAlpha2}" class="fi fi-${isoAlpha2.toLowerCase()}"></span>`
            }

            return '<span></span>';
        }

        //Event handler for dealing with changes to the country input
        function inpCountryChange(evnt) {
            let opt = null, newIsoAlpha2 = '';

            for(let i = 0; i < dataList.children.length; i++) {
                if(dataList.children[i].value === evnt.target.value) {
                    opt = dataList.children[i];
                    break;
                }
            }

            if(opt) {
                newIsoAlpha2 = opt.getAttribute(CTRY_ISO_ALPHA2);
            }

            if(!newIsoAlpha2 && inpCountry.value.length === 2) {
                const oCountry = isoCountries.get(inpCountry.value.toUpperCase());

                if(oCountry?.name) {
                    newIsoAlpha2 = inpCountry.value.toUpperCase();
                    inpCountry.value = oCountry.name;
                }
            }

            if(!newIsoAlpha2 && inpCountry.value.length > 2) {
                const oCountry = [...isoCountries.values()].find(elem => elem.name?.toUpperCase() === inpCountry.value.toUpperCase());

                if(oCountry) {
                    newIsoAlpha2 = oCountry.alpha2;
                    inpCountry.value = oCountry.name;
                }
            }

            if(newIsoAlpha2) {
                inpCountry.setAttribute(CTRY_ISO_ALPHA2, newIsoAlpha2)
                divFlag.innerHTML = flagSpan(newIsoAlpha2);
            }
            else { //Invalid input
                inpCountry.setAttribute(CTRY_ISO_ALPHA2, '')
                divFlag.innerHTML = flagSpan('');
            }
        }

        //Submit button click event
        function submitClick() {
            const searchCriteria = {};

            searchCriteriaForm.querySelectorAll('input').forEach(inp => { 
                if(inp.value) searchCriteria[inp.name] = inp.value;

                if(inp === inpCountry) searchCriteria.isoAlpha2 = inp.getAttribute(CTRY_ISO_ALPHA2);
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

            resetClick.call(this);
        }

        //Reset button click event
        function resetClick() {
            searchCriteriaForm.querySelectorAll('input').forEach(inp => {
                if(inp !== inpCountry) {
                    inp.value = this.iniValues?.[inp.name] ? this.iniValues[inp.name] : '';
                    inp.dispatchEvent(new Event('change', { bubbles: false }));
                }
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

        //Create label/input elements, country first
        let divFormRow = formRow.cloneNode();
        divFormRow.classList.add(MULT_ELEM);

        //Add the div for the country flag and set flag properties
        divFormRow.appendChild(divFlag);

        divFlag.classList.add(FLAG_ICON);
        divFlag.style.flex = '5'; //div takes op 5% of the row's width

        //The text input element for specifying a country name
        let divInpText = inpText.cloneNode();
        divInpText.style.flex = '95'; //div takes op 95% of the row's width

        divInpText.appendChild(getInputElement(inpElems.get('search-country')));
        
        divFormRow.appendChild(divInpText);
        searchCriteriaForm.appendChild(divFormRow);

        //An input element with id search-country must be available
        inpCountry = divInpText.querySelector('#search-country');

        //Associate the input element with a list of options
        inpCountry.setAttribute('list', CTRY_DATA_LIST);
        inpCountry.addEventListener('change', inpCountryChange);

        //Create label/input elements for name criterium
        divFormRow = formRow.cloneNode();
        divInpText = inpText.cloneNode();

        divInpText.appendChild(getInputElement(inpElems.get('search-name')));

        divFormRow.appendChild(divInpText);
        searchCriteriaForm.appendChild(divFormRow);

        inpName = divInpText.querySelector('#search-name'); //for set focus

        if(this.iniValues.isoAlpha2) {
            inpCountry.value = this.iniValues.isoAlpha2;
            inpCountry.dispatchEvent(new Event('change', { bubbles: false }));
        }

        divFlag.innerHTML = flagSpan(inpCountry.getAttribute(CTRY_ISO_ALPHA2));

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
