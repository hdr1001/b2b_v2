/* ********************************************************************
//
// Business-to-business (B2B) application v2
// HTML custom component for displaying B2B reports
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
import { getLeiSections } from '../gleif/leiLavs.js';
const cssB2bReport = new URL('./css/b2bReport.css', import.meta.url).href;

//A HTML5 B2B report custom component class
export default class B2bReport extends HTMLElement {
    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });

        //The b2bKey property contains B2B key value
        this.b2bKey = this.getAttribute('b2b-key') || '0';

        //Create an B2B object wrapper
        this.b2bRec = new LeiRec(LEIs[this.b2bKey]);

        //Array of report sections
        this.sections = getLeiSections(this.b2bRec);
    }

    //Observe the 'b2bKey' attribute for changes
    static observedAttributes = ['b2b-key'];

    //In case the 'id' attribute changes, update the component's content
    attributeChangedCallback(name, oldValue, newValue) {
        if(name === 'b2b-key' && oldValue !== newValue) {
            this.b2bKey = newValue;

            this.renderComponentUpdate();
        }
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //Create a link to the component's CSS file
        const css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssB2bReport);

        this.shadowRoot.appendChild(css);

        const b2bRptDiv = document.createElement('div');
        b2bRptDiv.classList.add('b2b-report');

        this.shadowRoot.appendChild(b2bRptDiv);

        this.sections.forEach(section => b2bRptDiv.appendChild(section.domElems));
    }

    //When the component is removed from the DOM, clean up references
    disconnectedCallback() {
        this.b2bKey = '';
        this.oB2B = null;
        this.b2bRec = null;
        this.sections = null;
    }

    //Render the component's content based on the current 'id' attribute
    renderComponentUpdate() {
        this.b2bRec = new LeiRec(LEIs[this.b2bKey]);

        this.sections = getLeiSections(this.b2bRec)

        //Reset the report content
        this.shadowRoot.querySelectorAll('.rpt-section-wrapper').forEach(rptSection => rptSection.remove());

        const b2bRptDiv = this.shadowRoot.querySelector('div.b2b-report');
    
        //Append a table with label/value pairs for the current LEI record
        this.sections.forEach(section => b2bRptDiv.appendChild(section.domElems));
    }
}
