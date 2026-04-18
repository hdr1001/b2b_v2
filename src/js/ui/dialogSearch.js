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

const iniValues = {
    country: 'NL',
    name: '',
    addr1: '',
    addr2: '',
    postalCode: '',
    city: '',
    regNumber: ''
};

export default function addDialogSearch() {
    //Onclick event handler for text-input elements
    function hasNoneEmptyValue(evnt) {
        if(!evnt.currentTarget.value) {
            evnt.currentTarget.classList.remove('has-none-empty-value');
            return;
        }

        evnt.currentTarget.classList.add('has-none-empty-value');
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

        button.addEventListener('click', evt => console.log(`${name} clicked event`));

        return button;
    }

    //The text-input elements which are part of the dialog
    const inpElems = new Map([
        ['search-country', {id: 'search-country', name: 'country', value: iniValues.country, label: 'Country'}],
        ['search-name', {id: 'search-name', name: 'name', value: iniValues.name, label: 'Name'}],
        ['search-addr1', {id: 'search-addr1', name: 'addr1', value: iniValues.addr1, label: 'Address 1'}],
        ['search-addr2', {id: 'search-addr2', name: 'addr2', value: iniValues.addr2, label: 'Address 2'}],
        ['search-postal-code', {id: 'search-postal-code', name: 'postalCode', value: iniValues.postalCode, label: 'Postal code'}],
        ['search-city', {id: 'search-city', name: 'city', value: iniValues.city, label: 'City'}],
        ['search-reg-number', {id: 'search-reg-number', name: 'regNumber', value: iniValues.regNumber, label: 'Registration number'}]
    ]);

    //Create dialog element
    const dialogSearch = document.createElement('dialog');
    dialogSearch.id = 'dialog-search';

    //Create dialog title in a div
    const searchTitle = document.createElement('div');
    searchTitle.id = 'dialog-title';
    searchTitle.innerHTML = 'Search<i data-lucide="X" class="icon-close"></i>';
 
    dialogSearch.appendChild(searchTitle);

    //Create a form element
    const searchForm = document.createElement('form');

    //All input elements are created in a div with class html-input
    const dialogFormRow = document.createElement('div');
    dialogFormRow.classList.add('form-row');

    const divTypeaheadInput = document.createElement('div');
    divTypeaheadInput.classList.add('typeahead-input');

    const inpText = document.createElement('div');
    inpText.classList.add('input-text');

    //Create label/input elements, country first
    let divFormRow = dialogFormRow.cloneNode();
    let divInpText = inpText.cloneNode();

    divInpText.appendChild(getInputElement(inpElems.get('search-country')));
    divFormRow.appendChild(divInpText);
    searchForm.appendChild(divFormRow);

    const inpCountry = divInpText.querySelector('#search-country');

    if(inpCountry) {
        inpCountry.setAttribute('list', 'country-list');
        inpCountry.autocomplete = 'off';
    }

    const dataList = divFormRow.appendChild(document.createElement('datalist'));
    dataList.id = 'country-list';

    const docFrag = new DocumentFragment;

    [ 'The Netherlands', 'Belgium', 'Germany', 'France', 'United Kingdom' ].forEach(elem => {
        const opt = docFrag.appendChild(document.createElement('option'));
        opt.value = elem;
    });

    dataList.appendChild(docFrag);

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
    
    inpBtn.addEventListener('click', evt => {
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
