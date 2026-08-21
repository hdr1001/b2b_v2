/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Application's about dialog component  
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

import { createElement, X } from 'lucide';
import globals from '../globals.js';
import { getButtonElement } from '../elemsShared.js';

const cssB2bAbout = new URL('./css/b2bAbout.css', import.meta.url).href;

async function testUrlB2bApi() {
    const ret = { respOkay: false };

    const testUrl = `${globals.urlB2bApi}about`;

    try {
        const apiResp = await fetch(testUrl);

        if(!apiResp.ok) {
            ret.status = apiResp.status;

            throw new Error(`API data fetch resulted in HTTP status ${apiResp.status}`)
        }

        ret.respOkay = true;
        ret.status = apiResp.status;
        ret.msg = `API data fetch resulted in a HTTP status deemed okay ${apiResp.status}`;
    }
    catch(err) {
        ret.msg = err.message;
    }

    return ret;
}

//A HTML5 B2B waiting animation custom component class
export default class B2bAbout extends HTMLElement {
    #dialogAbout;
    #connectionForm;

    //Event handling functions
    #tabClick = evnt => {
        this.#dialogAbout.querySelectorAll('.tab-content').forEach(tab => {
            if(tab.id === evnt.target.id.slice(4)) {
                tab.style.display = 'block';
            }
            else {
                tab.style.display = 'none';
            }
        })
    };

    #connBtnClicked = async evnt => {
        if(evnt.target.id === 'connection-btn-test') {
            const testRslt = await testUrlB2bApi();

            console.log('Test of connection parameters: ' + testRslt.respOkay);

            return;
        }
        else if(evnt.target.id === 'connection-btn-reset') {
            console.log('Reset connection parameters');
            return;
        }
        else if(evnt.target.id === 'connection-btn-save') {
            console.log('Save connection parameters');
            return;
        }
    };

    #dialogClose = evnt => { if(evnt.target === this.#dialogAbout) this.close() };
    #iconClose = () => this.close();

    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });

        //Create a link to the component's CSS file
        let css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssB2bAbout);

        //Add link to the css file to the shadow DOM
        this.shadowRoot.appendChild(css);
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //The actual content of the general tab consists of header/data pairs
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

        //Function to create a fieldset element
        const getFieldsetElement = fsElem => {
            const fieldset = document.createElement('fieldset');
            fieldset.id = fsElem.id;

            if(fsElem.legend) {
                const legend = document.createElement('legend');
                legend.textContent = fsElem.legend;
                fieldset.appendChild(legend);
            }

            return fieldset;
        }

        //Function to create a label/(text-)input element pair
        const getInputElement = inpElem => {
            const fldSet = getFieldsetElement( {id: `fs-${inpElem.id}`} );

            const lbl = document.createElement('label');
            lbl.htmlFor = inpElem.id;
            lbl.textContent = inpElem.label;

            const inp = document.createElement('input');
            inp.type = 'text';
            inp.id = inpElem.id;
            inp.name = inpElem.name;
            inp.value = inpElem.value || '';

            lbl.appendChild(inp);
            fldSet.appendChild(lbl);

            return fldSet;
        }

        //This component is a dialog, so create a dialog element in the shadow DOM tree
        this.#dialogAbout = document.createElement('dialog');
        this.#dialogAbout.id = 'dialog-about';

        //Add methods to show and close to the B2bAbout element
        this.showModal = () => this.#dialogAbout.showModal();
        this.close = () => this.#dialogAbout.close();

        //Finish the component's framework
        this.shadowRoot.appendChild(this.#dialogAbout);

        //Construct the title bar of the dialog
        const aboutTitle = document.createElement('div');
        aboutTitle.id = 'dialog-title';
        aboutTitle.innerText = 'About B2B v2';

        //The title bar also contains a close icon
        const iconClose = createElement(X);
        iconClose.classList.add('icon-close');
        aboutTitle.appendChild(iconClose);
    
        this.#dialogAbout.appendChild(aboutTitle);

        //The about dialog has two tabs
        const tabContainer = document.createElement('div');
        tabContainer.classList.add('tab-container');

        const tabCtrls = document.createElement('div');
        tabCtrls.classList.add('tab-controls');

        //Create the buttons for the tab controls and add event listeners to them
        let btn = tabCtrls.appendChild(getButtonElement('btn-about-general', 'about', 'About'));
        btn.addEventListener('click', this.#tabClick);

        btn = tabCtrls.appendChild(getButtonElement('btn-about-connection', 'connection', 'Connection'));
        btn.addEventListener('click', this.#tabClick);

        tabContainer.appendChild(tabCtrls);

        //Create the content of the tabs in divs with the class 'tab-content'
        let tabContentDiv = document.createElement('div');
        tabContentDiv.classList.add('tab-content');
        tabContentDiv.id = 'about-general';

        //Display the about information in a table
        const table = document.createElement('table');

        addAboutRow(table, 'Application', 'Business-to-business');
        addAboutRow(table, 'Version', '2.0.0');
        addAboutRow(table, 'Copyright', '\u00A9 2026 Hans de Rooij');
        addAboutRow(table, 'License', 'Apache 2.0');
        addAboutRow(table, 'Hosted on', window.location?.host || 'N/A');

        //Add the table in a content div and add the content div to the dialog
        tabContentDiv.appendChild(table);

        //Add the tab content to the tab container
        tabContainer.appendChild(tabContentDiv);

        //Create the second tab content div for the connection parameters
        tabContentDiv = document.createElement('div');
        tabContentDiv.classList.add('tab-content');
        tabContentDiv.id = 'about-connection';
        tabContentDiv.style.display = 'none';

        //Create a form element to specify the connection parameters
        this.#connectionForm = document.createElement('form');

        //Add the form element to the connection tab
        tabContentDiv.appendChild(this.#connectionForm);

        //Create a fieldset element for the connection parameters
        const frmFieldsTop = getFieldsetElement({id: 'connection-parameters', legend: 'Connection parameters'});
        this.#connectionForm.appendChild(frmFieldsTop);

        //Create a fieldset element for the connection protocol parameters
        let frmFields = getFieldsetElement({id: 'connection-protocol'});
        frmFieldsTop.appendChild(frmFields);

        //option 1: http
        let lbl = document.createElement('label');
        lbl.setAttribute('for', 'connection-protocol-http');
        lbl.innerText = 'HTTP';
        frmFields.appendChild(lbl);

        let connProtocol = globals.urlB2bApi.protocol && globals.urlB2bApi.protocol.toLowerCase();
        if(connProtocol && connProtocol.slice(-1) === ':') connProtocol = connProtocol.slice(0, -1);

        let radioBtn = document.createElement('input');
        radioBtn.type = 'radio';
        radioBtn.name = 'connection-protocol';
        radioBtn.id = 'connection-protocol-http';
        radioBtn.value = 'http';
        if(connProtocol === 'http') radioBtn.checked = true;
        lbl.appendChild(radioBtn);

        //option 2: https
        lbl = document.createElement('label');
        lbl.setAttribute('for', 'connection-protocol-https');
        lbl.innerText = 'HTTPS';
        frmFields.appendChild(lbl);

        radioBtn = document.createElement('input');
        radioBtn.type = 'radio';
        radioBtn.name = 'connection-protocol';
        radioBtn.id = 'connection-protocol-https';
        radioBtn.value = 'https';
        if(connProtocol === 'https') radioBtn.checked = true;
        lbl.appendChild(radioBtn);

        //Add the text input fields for the connection parameters
        frmFieldsTop.appendChild(getInputElement(
            {id: 'connection-host', name: 'connection-host', label: 'Host', value: globals.urlB2bApi.hostname}
        ));
        frmFieldsTop.appendChild(getInputElement(
            {id: 'connection-port', name: 'connection-port', label: 'Port', value: globals.urlB2bApi.port}
        ));
        frmFieldsTop.appendChild(getInputElement(
            {id: 'connection-path', name: 'connection-path', label: 'Path', value: globals.urlB2bApi.pathname}
        ));

        //Create a fieldset element for the connection protocol parameters
        frmFields = getFieldsetElement({id: 'connection-btns'});
        frmFieldsTop.appendChild(frmFields);

        btn = getButtonElement('connection-btn-test', 'test', 'Test');
        btn.addEventListener('click', this.#connBtnClicked);
        frmFields.appendChild(btn);

        btn = getButtonElement('connection-btn-reset', 'reset', 'Reset');
        btn.addEventListener('click', this.#connBtnClicked);
        frmFields.appendChild(btn);

        btn = getButtonElement('connection-btn-save', 'save', 'Save');
        btn.addEventListener('click', this.#connBtnClicked);
        frmFields.appendChild(btn);

        //Add the tab content to the tab container
        tabContainer.appendChild(tabContentDiv);

        //Add the tab container to the dialog
        this.#dialogAbout.appendChild(tabContainer);

        //Add an event listener to close the dialog when clicking outside of it
        this.#dialogAbout.addEventListener('click', this.#dialogClose);

        //Add an event listener to the close icon to close the dialog
        iconClose.addEventListener('click', this.#iconClose);
    }

    disconnectedCallback() {
        //Remove the event listeners
        let btns = this.#dialogAbout.querySelectorAll('.tab-controls button');

        if(btns) {
            btns.forEach(btn => btn.removeEventListener('click', this.#tabClick));
        }

        btns = this.#connectionForm.querySelectorAll('#connection-btns button');

        if(btns) {
            btns.forEach(btn => btn.removeEventListener('click', this.#connBtnClicked));
        }

        this.#dialogAbout.removeEventListener('click', this.#dialogClose);

        const iconClose = this.#dialogAbout.querySelector('.icon-close');
        if(iconClose) iconClose.removeEventListener('click', this.#iconClose);
    }
}

customElements.define('b2b-about', B2bAbout);
