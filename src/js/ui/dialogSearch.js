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

function hasNoneEmptyValue(evnt) {
    if(!evnt.currentTarget.value) {
        evnt.currentTarget.classList.remove('has-none-empty-value');
        return;
    }

    evnt.currentTarget.classList.add('has-none-empty-value');
}

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

function getButtonElement(id, name, label) {
    const button = document.createElement('button');

    button.id = id;
    button.name = name;
    button.type = 'button';

    button.textContent = label;

    button.addEventListener('click', evt => console.log(`${name} clicked event`));

    return button;
}

export default function addDialogSearch(parent) {
    if(!parent) return;

    const dialogSearch = document.createElement('dialog');
    dialogSearch.id = 'dialog-search';

    const searchTitle = document.createElement('div');
    searchTitle.id = 'dialog-title';
    searchTitle.innerHTML = 'Search<i data-lucide="X" class="icon-close"></i>';
 
    dialogSearch.appendChild(searchTitle);

    const searchForm = document.createElement('form');

    const inpElems = new Map([
        ['search-country', {id: 'search-country', name: 'country', value: iniValues.country, label: 'Country'}],
        ['search-name', {id: 'search-name', name: 'name', value: iniValues.name, label: 'Name'}],
        ['search-addr1', {id: 'search-addr1', name: 'addr1', value: iniValues.addr1, label: 'Address 1'}],
        ['search-addr2', {id: 'search-addr2', name: 'addr2', value: iniValues.addr2, label: 'Address 2'}],
        ['search-postal-code', {id: 'search-postal-code', name: 'postalCode', value: iniValues.postalCode, label: 'Postal code'}],
        ['search-city', {id: 'search-city', name: 'city', value: iniValues.city, label: 'City'}],
        ['search-reg-number', {id: 'search-reg-number', name: 'regNumber', value: iniValues.regNumber, label: 'Registration number'}]
    ]);

    let htmlInputDiv = document.createElement('div');
    htmlInputDiv.classList.add('html-input');

    let div = htmlInputDiv.cloneNode();
    div.appendChild(getInputElement(inpElems.get('search-country')));
    searchForm.appendChild(div);

    div = htmlInputDiv.cloneNode();
    div.appendChild(getInputElement(inpElems.get('search-name')));
    searchForm.appendChild(div);

    div = htmlInputDiv.cloneNode();
    div.appendChild(getInputElement(inpElems.get('search-addr1')));
    searchForm.appendChild(div);

    div = htmlInputDiv.cloneNode();
    div.appendChild(getInputElement(inpElems.get('search-addr2')));
    searchForm.appendChild(div);

    div = htmlInputDiv.cloneNode();
    div.classList.add('one-row');
    div.appendChild(getInputElement(inpElems.get('search-postal-code')));
    div.appendChild(getInputElement(inpElems.get('search-city')));
    searchForm.appendChild(div);

    div = htmlInputDiv.cloneNode();
    div.appendChild(getInputElement(inpElems.get('search-reg-number')));
    searchForm.appendChild(div);

    htmlInputDiv.classList.add('one-row');

    let button = getButtonElement('search-submit', 'submit', 'Submit');

    htmlInputDiv.appendChild(button);

    button = getButtonElement('search-reset', 'reset', 'Reset');

    htmlInputDiv.appendChild(button);

    searchForm.appendChild(htmlInputDiv)

    dialogSearch.appendChild(searchForm);

    parent.appendChild(dialogSearch);
}
