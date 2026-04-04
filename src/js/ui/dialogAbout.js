/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Application's about dialog component code  
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

function addAboutRow(table, sHeader, sData) {
    const tr = document.createElement('tr');
    const th = document.createElement('th');
    th.textContent = sHeader;
    tr.appendChild(th);

    const td = document.createElement('td');
    td.textContent = sData;
    tr.appendChild(td);

    table.appendChild(tr);
}

export default function addDialogAbout(parent) {
    if(!parent) return;

    const dialogAbout = document.createElement('dialog');
    dialogAbout.id = 'dialog-about';

    const aboutTitle = document.createElement('div');
    aboutTitle.id = 'dialog-title';
    aboutTitle.innerHTML = 'About B2B v2<i data-lucide="X" class="icon-close"></i>';
 
    dialogAbout.appendChild(aboutTitle);

    const table = document.createElement('table');

    addAboutRow(table, 'Application:', 'Business-to-business');
    addAboutRow(table, 'Version:', '2.0.0');
    addAboutRow(table, 'Copyright:', '\u00A9 2026 Hans de Rooij');
    addAboutRow(table, 'License:', 'Apache 2.0');

    dialogAbout.appendChild(table);

    parent.appendChild(dialogAbout);
}
