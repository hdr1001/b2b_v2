/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Application's search dialog code  
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

import { isoCountries } from '../../assets/codes/isoCountries';
import '/node_modules/flag-icons/css/flag-icons.min.css';

const CTRY_DATA_LIST = 'country-list';
const CTRY_ISO_ALPHA2 = 'data-iso-alpha2';
const HAS_NONE_EMPTY_VALUE = 'has-none-empty-value';

const iniValues = {
    isoAlpha2: 'NL' //Please specify the country code in uppercase
};

//Create a span to hold the https://flagicons.lipis.dev/ flags
function flagSpan(isoAlpha2) {
    if(isoAlpha2) {
        return `<span data-iso-alpha2="${isoAlpha2}" class="fi fi-${isoAlpha2.toLowerCase()}"></span>`
    }

    return '<span></span>';
}

//Code for creating the search dialog
export default function addDialogSearch() {
    //String constants
    const DIALOG_SEARCH = 'dialog-search';
    const DIALOG_TITLE = 'dialog-title';
    const FORM_ROW = 'form-row';
    const FLAG_ICON = 'flag-icon';
    const MULT_ELEM = 'mult-elem';
    const INPUT_TXT = 'input-text';
    const ROW_ADDR2 = 'row-addr2';

    //The text-input elements which are part of the dialog
    const inpElems = new Map([
        ['search-isoAlpha2', {id: 'search-isoAlpha2', name: 'isoAlpha2', value: iniValues.isoAlpha2, label: 'ISO'}],
        ['search-country', {id: 'search-country', name: 'country', value: iniValues.country, label: 'Country'}],
        ['search-name', {id: 'search-name', name: 'name', value: iniValues.name, label: 'Name'}],
        ['search-addr1', {id: 'search-addr1', name: 'addr1', value: iniValues.addr1, label: 'Address 1'}],
        ['search-addr2', {id: 'search-addr2', name: 'addr2', value: iniValues.addr2, label: 'Address 2'}],
        ['search-postal-code', {id: 'search-postal-code', name: 'postalCode', value: iniValues.postalCode, label: 'Postal code'}],
        ['search-city', {id: 'search-city', name: 'city', value: iniValues.city, label: 'City'}],
        ['search-reg-number', {id: 'search-reg-number', name: 'regNumber', value: iniValues.regNumber, label: 'Registration number'}]
    ]);

    //References to specific dialog parts
    const dialogSearch = document.createElement('dialog');
    const searchTitle = document.createElement('div');
    const searchForm = document.createElement('form');
    const divFlag = document.createElement('div');
    let inpCountry = null; //Will be associated with the country text input
    let inpName = null; //Will be associated with the name text input

    //A data list containing countries
    const dataList = dialogSearch.appendChild(document.createElement('datalist'));
    dataList.id = CTRY_DATA_LIST;

    //onclick event handler for text-input elements
    function hasNoneEmptyValue(evnt) {
        if(!evnt.currentTarget.value) {
            evnt.currentTarget.classList.remove(HAS_NONE_EMPTY_VALUE);
            return;
        }

        evnt.currentTarget.classList.add(HAS_NONE_EMPTY_VALUE);
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

            if(oCountry.name) {
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

    //Function to handle everything related to dialog open/close
    function dialogOpenClose(evnt) {
        if(evnt.newState === 'open' && divFlag) {
            //Update the country flag in case the country text input and flag are not in sync
            if(inpCountry.getAttribute(CTRY_ISO_ALPHA2) !== divFlag?.firstChild.getAttribute(CTRY_ISO_ALPHA2)) {
                divFlag.innerHTML = flagSpan(inpCountry.getAttribute(CTRY_ISO_ALPHA2))
            }

            if(inpCountry.getAttribute(CTRY_ISO_ALPHA2)) {
                inpName.focus();
            }
        }
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

        button.addEventListener('click', evnt => console.log(`${name} clicked event`));

        return button;
    }

    //Set dialog properties
    dialogSearch.id = DIALOG_SEARCH;
    dialogSearch.addEventListener('toggle', dialogOpenClose);

    //Set dialog title and add a close icon 
    searchTitle.id = DIALOG_TITLE;
    searchTitle.innerHTML = 'Search<i data-lucide="X" class="icon-close"></i>';
 
    dialogSearch.appendChild(searchTitle);

    //All input elements are laid out in rows
    const dialogFormRow = document.createElement('div');
    dialogFormRow.classList.add(FORM_ROW);

    //All input elements are created in a div with class html-input
    const inpText = document.createElement('div');
    inpText.classList.add(INPUT_TXT);

    //Create label/input elements, country first
    let divFormRow = dialogFormRow.cloneNode();
    divFormRow.classList.add(MULT_ELEM);

    //Add the div for the country flag and set flag properties
    divFormRow.appendChild(divFlag);

    divFlag.classList.add(`${MULT_ELEM}-5`, FLAG_ICON);
    divFlag.innerHTML = flagSpan('');

    //The text input element for specifying a country name
    let divInpText = inpText.cloneNode();
    divInpText.classList.add(`${MULT_ELEM}-95`)

    divInpText.appendChild(getInputElement(inpElems.get('search-country')));
    
    divFormRow.appendChild(divInpText);
    searchForm.appendChild(divFormRow);

    //An input lement with id search-country must be available
    inpCountry = divInpText.querySelector('#search-country');

    //Associate the input element with a list of options
    inpCountry.setAttribute('list', CTRY_DATA_LIST);
    inpCountry.addEventListener('change', inpCountryChange);

    //Create label/input elements for name
    divFormRow = dialogFormRow.cloneNode();
    divInpText = inpText.cloneNode();

    divInpText.appendChild(getInputElement(inpElems.get('search-name')));

    inpName = divInpText.querySelector('#search-name'); //for set focus

    divFormRow.appendChild(divInpText);
    searchForm.appendChild(divFormRow);

    //Create label/input elements for address 1
    divFormRow = dialogFormRow.cloneNode();
    divInpText = inpText.cloneNode();

    divInpText.appendChild(getInputElement(inpElems.get('search-addr1')));

    //Add a button to toggle the visibility of the address 2 element
    const inpBtn = document.createElement('button');
    inpBtn.type = 'button';
    inpBtn.innerHTML = '<i data-lucide="Plus"></i><i data-lucide="Minus" class="display-none"></i>';
    
    inpBtn.addEventListener('click', evnt => {
        inpBtn.querySelectorAll('svg').forEach(svg => svg.classList.toggle('display-none'));

        const divAddr2 = searchForm.querySelector(`#${ROW_ADDR2}`);

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
    searchForm.appendChild(divFormRow);

    //Create label/input elements for address 2
    divFormRow = dialogFormRow.cloneNode();
    divFormRow.id = ROW_ADDR2;
    divFormRow.classList.add('display-none');
    divInpText = inpText.cloneNode();

    divInpText.appendChild(getInputElement(inpElems.get('search-addr2')));
    divFormRow.appendChild(divInpText);
    searchForm.appendChild(divFormRow);

    //Create label/input elements for postal code and city on the same row
    divFormRow = dialogFormRow.cloneNode();
    divFormRow.classList.add(MULT_ELEM);

    divInpText = inpText.cloneNode();
    divInpText.classList.add(`${MULT_ELEM}-4`);

    divInpText.appendChild(getInputElement(inpElems.get('search-postal-code')));
    divFormRow.appendChild(divInpText);

    divInpText = inpText.cloneNode();
    divInpText.classList.add(`${MULT_ELEM}-6`);

    divInpText.appendChild(getInputElement(inpElems.get('search-city')));

    divFormRow.appendChild(divInpText);
    searchForm.appendChild(divFormRow);

    //Create label/input elements for registration number
    divFormRow = dialogFormRow.cloneNode();
    divInpText = inpText.cloneNode();

    divInpText.appendChild(getInputElement(inpElems.get('search-reg-number')));
    divFormRow.appendChild(divInpText);
    searchForm.appendChild(divFormRow);

    //The last row in the form contains buttons
    divFormRow = dialogFormRow.cloneNode();
    divFormRow.classList.add('submit-reset');

    let button = getButtonElement('search-submit', 'submit', 'Submit');

    divFormRow.appendChild(button);

    button = getButtonElement('search-reset', 'reset', 'Reset');

    divFormRow.appendChild(button);

    searchForm.appendChild(divFormRow);
    dialogSearch.appendChild(searchForm);

    return dialogSearch;
}

export function populateDataList() {
    const docFrag = new DocumentFragment;

    isoCountries.forEach(elem => {
        const opt = docFrag.appendChild(document.createElement('option'));

        opt.value = elem.name;
        opt.setAttribute(CTRY_ISO_ALPHA2, elem.alpha2);

        if(elem.alpha2 === iniValues.isoAlpha2) {
            const inpCountry = document.querySelector('#search-country');
            inpCountry.value = elem.name;

            inpCountry.setAttribute(CTRY_ISO_ALPHA2, elem.alpha2);
            inpCountry.classList.add(HAS_NONE_EMPTY_VALUE);
        }
    });

    document.querySelector(`#${CTRY_DATA_LIST}`).appendChild(docFrag);
}
