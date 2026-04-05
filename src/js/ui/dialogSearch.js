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

export default function addDialogSearch(parent) {
    if(!parent) return;

    const dialogSearch = document.createElement('dialog');
    dialogSearch.id = 'dialog-search';

    const searchTitle = document.createElement('div');
    searchTitle.id = 'dialog-title';
    searchTitle.innerHTML = 'Search<i data-lucide="X" class="icon-close"></i>';
 
    dialogSearch.appendChild(searchTitle);

    const searchForm = document.createElement('form');

    let div = document.createElement('div');

    let searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-country';
    searchInput.name = 'country';

    div.appendChild(searchInput);
    div.setAttribute('class', 'html-input');

    let formLabel = document.createElement('label');
    formLabel.setAttribute('for', 'search-country');
    formLabel.textContent = 'Country';

    div.appendChild(formLabel);
    searchForm.appendChild(div);

    div = document.createElement('div');

    searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.id = 'search-name';
    searchInput.name = 'name';

    div.appendChild(searchInput);
    div.setAttribute('class', 'html-input');

    formLabel = document.createElement('label');
    formLabel.setAttribute('for', 'search-name');
    formLabel.textContent = 'Name';

    div.appendChild(formLabel);
    searchForm.appendChild(div);

    dialogSearch.appendChild(searchForm);

    parent.appendChild(dialogSearch);
}
