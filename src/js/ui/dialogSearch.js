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

const iniValues = {
    isoAlpha2: 'BE'
};

//Create a span to hold the https://flagicons.lipis.dev/ flags
function flagSpan(isoAlpha2) {
    if(isoAlpha2) {
        return `<span data-iso-alpha2="${isoAlpha2}" class="fi fi-${isoAlpha2.toLowerCase()}"></span>`
    }

    return '<span></span>';
}

export default function addDialogSearch() {
    //References to specific dialog parts
    const dialogSearch = document.createElement('dialog');
    const searchTitle = document.createElement('div');
    const searchForm = document.createElement('form');
    const divFlag = document.createElement('div');
    let inpCountry = null; //Will be associated with the country text input

    //A data list containing countries
    const dataList = dialogSearch.appendChild(document.createElement('datalist'));
    dataList.id = 'country-list';

    //onclick event handler for text-input elements
    function hasNoneEmptyValue(evnt) {
        if(!evnt.currentTarget.value) {
            evnt.currentTarget.classList.remove('has-none-empty-value');
            return;
        }

        evnt.currentTarget.classList.add('has-none-empty-value');
    }

    //Sync up flag with selected country
    function syncUpFlag(isoCountry) {

    }

    //Event handler for dealing with changes to the country input
    function inpCountryChange(evnt) {
        console.log(event.target.getAttribute('data-iso-country'))
    }

    //Function to handle everything related to dialog open/close
    function dialogOpenClose(evnt) {
        const inpFlag = dialogSearch.querySelector('.flag-icon');

        if(evnt.newState === 'open' && inpFlag) {
            const isoCountry = inpFlag.firstChild.getAttribute('data-iso-alpha2');

            const inpCountry = dialogSearch.querySelector('#search-country');

            if(inpCountry) inpCountry.value = isoCountries.get(isoCountry)?.name;
        }
    }

    //Function to create a label/(text-)input element pair
    function getInputElement(inpElem) {
        const docFrag = document.createDocumentFragment();

        const input = document.createElement('input');
        input.type = 'text';
        input.id = inpElem.id;
        input.name = inpElem.name;

        if(inpElem.value) {
            input.value = inpElem.value;
            input.classList.add('has-none-empty-value');
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

    //Set dialog properties
    dialogSearch.id = 'dialog-search';
    dialogSearch.addEventListener('toggle', dialogOpenClose);

    //Set dialog title and add a close icon 
    searchTitle.id = 'dialog-title';
    searchTitle.innerHTML = 'Search<i data-lucide="X" class="icon-close"></i>';
 
    dialogSearch.appendChild(searchTitle);

    //All input elements are laid out in rows
    const dialogFormRow = document.createElement('div');
    dialogFormRow.classList.add('form-row');

    //All input elements are created in a div with class html-input
    const inpText = document.createElement('div');
    inpText.classList.add('input-text');

    //Create label/input elements, country first
    let divFormRow = dialogFormRow.cloneNode();
    divFormRow.classList.add('mult-elem');

    //Add the div for the country flag and set flag properties
    divFormRow.appendChild(divFlag);

    divFlag.classList.add('mult-elem-5', 'flag-icon');
    divFlag.innerHTML = flagSpan(iniValues.isoAlpha2);

    //The text input element for specifying a country name
    let divInpText = inpText.cloneNode();
    divInpText.classList.add('mult-elem-95')

    divInpText.appendChild(getInputElement(inpElems.get('search-country')));
    
    divFormRow.appendChild(divInpText);
    searchForm.appendChild(divFormRow);

    //An input lement with id search-country must be available
    inpCountry = divInpText.querySelector('#search-country');

    //Associate the input element with a list of options
    inpCountry.setAttribute('list', 'country-list');
    inpCountry.addEventListener('change', inpCountryChange)

    const docFrag = new DocumentFragment;

    [ 
        { alpha2: 'BE', name: 'Belgium' },
        { alpha2: 'DE', name: 'Germany' },
        { alpha2: 'FR', name: 'France' },
        { alpha2: 'GB', name: 'Great Britain' },
        { alpha2: 'NL', name: 'The Netherlands' },
    ]
    .forEach(elem => {
        const opt = docFrag.appendChild(document.createElement('option'));

        opt.value = elem.name;
        opt.setAttribute('data-iso-Alpha2', elem.alpha2);

        if(elem.alpha2 === iniValues.isoAlpha2) {
            opt.setAttribute('selected', true);
            inpCountry.setAttribute('data-iso-country', elem.alpha2);
            inpCountry.classList.add('has-none-empty-value');
        }
    });

    dataList.appendChild(docFrag);

    //Sync up the flag with the country input
    syncUpFlag();

    //Create label/input elements for name
    divFormRow = dialogFormRow.cloneNode();
    divInpText = inpText.cloneNode();

    divInpText.appendChild(getInputElement(inpElems.get('search-name')));
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

        const divAddr2 = searchForm.querySelector('#row-addr2');

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
    divFormRow.id = 'row-addr2';
    divFormRow.classList.add('display-none');
    divInpText = inpText.cloneNode();

    divInpText.appendChild(getInputElement(inpElems.get('search-addr2')));
    divFormRow.appendChild(divInpText);
    searchForm.appendChild(divFormRow);

    //Create label/input elements for postal code and city on the same row
    divFormRow = dialogFormRow.cloneNode();
    divFormRow.classList.add('mult-elem');

    divInpText = inpText.cloneNode();
    divInpText.classList.add('mult-elem-4');

    divInpText.appendChild(getInputElement(inpElems.get('search-postal-code')));
    divFormRow.appendChild(divInpText);

    divInpText = inpText.cloneNode();
    divInpText.classList.add('mult-elem-6');

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
