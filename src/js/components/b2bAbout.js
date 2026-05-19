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

const cssB2bAbout = new URL('./css/b2bAbout.css', import.meta.url).href;

//A HTML5 B2B waiting animation custom component class
export default class B2bAbout extends HTMLElement {
    #dialogAbout;

    //Event handling functions
    #dialogClose = evnt => { if(evnt.target === this.#dialogAbout) this.close() }
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
        //The actual content consists of header/data pairs
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

        //Display the about information in a table
        const table = document.createElement('table');

        addAboutRow(table, 'Application', 'Business-to-business');
        addAboutRow(table, 'Version', '2.0.0');
        addAboutRow(table, 'Copyright', '\u00A9 2026 Hans de Rooij');
        addAboutRow(table, 'License', 'Apache 2.0');
        addAboutRow(table, 'Hosted on', window.location?.host || 'N/A');

        this.#dialogAbout.appendChild(table);

        //Add an event listener to close the dialog when clicking outside of it
        this.#dialogAbout.addEventListener('click', this.#dialogClose);

        //Add an event listener to the close icon to close the dialog
        iconClose.addEventListener('click', this.#iconClose);
    }

    disconnectedCallback() {
        //Remove the event listeners
        this.#dialogAbout.removeEventListener('click', this.#dialogClose);

        const iconClose = this.#dialogAbout.querySelector('.icon-close');
        if(iconClose) iconClose.removeEventListener('click', this.#iconClose);
    }
}

customElements.define('b2b-about', B2bAbout);
