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

function hasChanged(evnt) {
    if(!evnt.currentTarget.value) {
        evnt.currentTarget.classList.remove('has-none-empty-value');
        return;
    }

    evnt.currentTarget.classList.add('has-none-empty-value');
}

function getInputElement(id, name, value, label) {
    const div = document.createElement('div');
    div.classList.add('html-input');

    const input = document.createElement('input');
    input.type = 'text';
    input.id = id;
    input.name = name;
    if(value) {
        input.value = value;
        input.classList.add('has-none-empty-value');
    }
    input.addEventListener('change', hasChanged);

    div.appendChild(input);

    const formLabel = document.createElement('label');
    formLabel.htmlFor = id;
    formLabel.textContent = label;

    div.appendChild(formLabel);

    return div;
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

    searchForm.appendChild(getInputElement('search-country', 'country', iniValues.country, 'Country'));
    searchForm.appendChild(getInputElement('search-name', 'name', iniValues.name, 'Name'));
    searchForm.appendChild(getInputElement('search-addr1', 'addr1', iniValues.addr1, 'Address 1'));
    searchForm.appendChild(getInputElement('search-addr2', 'addr2', iniValues.addr2, 'Address 2'));
/*
    const divOneLine = document.createElement('div');
    divOneLine.setAttribute('class', 'one-line');
*/
    searchForm.appendChild(getInputElement('search-postal-code', 'postalCode', iniValues.postalCode, 'Postal code'));
    searchForm.appendChild(getInputElement('search-city', 'city', iniValues.city, 'City'));
/*
    searchForm.appendChild(divOneLine);
*/
    searchForm.appendChild(getInputElement('search-reg-number', 'regNumber', iniValues.regNumber, 'Registration number'));

    const div = document.createElement('div');
    div.classList.add('html-input', 'one-row');

    let button = getButtonElement('search-submit', 'submit', 'Submit');

    div.appendChild(button);

    button = getButtonElement('search-reset', 'reset', 'Reset');

    div.appendChild(button);

    searchForm.appendChild(div)

    dialogSearch.appendChild(searchForm);

    parent.appendChild(dialogSearch);
}
