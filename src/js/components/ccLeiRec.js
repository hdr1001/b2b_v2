/* ********************************************************************
//
// Business-to-business (B2B) application v2
// HTML custom component for displaying LEI records as HTML
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

import { LEIs } from '../../assets/data/LEIs.js';
import LeiRec from '../gleif/leiRec.js';
//import { SectionTable } from '../ui/section.js';
const cssLeiRec = new URL('./css/leiRec.css', import.meta.url).href;

//A HTML5 LEI record custom component class
export default class CcLeiRec extends HTMLElement {
    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });

        //The idx property contains the index for the LEIs array
        this.idx = this.getAttribute('idx') || 0;

        //Contains a reference to the section element
        //when added to the DOM (otherwise null)
        this.section = null;
    }

    //Observe the 'idx' attribute for changes
    static observedAttributes = ['idx'];

    //In case the 'idx' attribute changes, update the component's content
    attributeChangedCallback(name, oldValue, newValue) {
        if(name === 'idx' && oldValue !== newValue) {
            this.idx = newValue;

            this.renderComponentUpdate();
        }
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //Create a link to the component's CSS file
        const css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssLeiRec);

        //Create the section element wrapping the content
        this.section = document.createElement('section');
        this.section.classList.add('lei-rec');

        //Append the content of a LEI record
        this.table = this.section.appendChild(new SectionTable(`LEI record ${this.idx}`).domElem);

        //Append the CSS link and section to the component's shadow DOM tree
        this.shadowRoot.appendChild(css);
        this.shadowRoot.appendChild(this.section);
    }

    //When the component is removed from the DOM, clean up references
    disconnectedCallback() { this.section = null }

    //Render the component's content based on the current 'idx' attribute
    renderComponentUpdate() {
        //When not yet connected to the DOM, this.section will be falsy 
        if(!this.section) return false;

        //Reset the section content
        this.section.innerHTML = '';

        //Append a table with label/value pairs for the current LEI record

    }
}
