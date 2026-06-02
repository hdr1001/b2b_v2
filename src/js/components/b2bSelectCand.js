/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Component for selecting a match candidate in a B2B search  
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

import LeiRec from '../gleif/leiRec.js';
import LabelArrValues from '../ui/lvsLabelArrValues.js';
import RptSection from '../ui/rptSection.js';

const cssB2bSelectCand = new URL('./css/b2bSelectCand.css', import.meta.url).href;

//Form related string constants
const FORM_ROW             = 'form-row';
const MATCH_CAND           = 'match-cand';
const RPT_SECTIONS_WRAPPER = 'rpt-sections-wrapper';
const LEI_KEY              = 'lei-key';
const BTN_SELECT           = 'select-cand';
const BTN_BACK             = 'select-back';

//A HTML5 B2B search criteria custom component class
export default class B2bSelectCand extends HTMLElement {
    #b2bSelectCand;  //Reference to the outermost div
    #selectCandForm; //Reference to the form element

    #leiMatchCands;  //Reference to an object containing the LEI match candidates

    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });

        //Create a link to the component's CSS file
        let css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssB2bSelectCand);

        //Add link to the css file to the shadow DOM
        this.shadowRoot.appendChild(css);               
    }

    set jsonMatchCands(jsonMCs) {
        this.#leiMatchCands = JSON.parse(jsonMCs);

        this.renderComponentUpdate();
    }

    //Observe the 'json-lei-cands' attribute for changes
    //static observedAttributes = ['json-lei-cands'];

    //In case the 'json-lei-cands' attribute changes, update the component's content
    attributeChangedCallback(name, oldValue, newValue) {
/*      
        if(name === 'json-lei-cands' && oldValue !== newValue) {
            this.#leiMatchCands = JSON.parse(newValue);

            if(this.isConnected) this.renderComponentUpdate();
        }
*/
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //References to specific form parts
        this.#b2bSelectCand = document.createElement('div');
        this.#selectCandForm = document.createElement('form');

        //Function to create a dialog button element
        function getButtonElement(id, name, label) {
            const button = document.createElement('button');

            button.id = id;
            button.name = name;
            button.type = 'button';

            button.textContent = label;

            return button;
        }

        //Create the component's HTML structure
        this.#b2bSelectCand.id = 'top-select-candidate';
        this.#b2bSelectCand.appendChild(this.#selectCandForm);

        //All input elements are laid out in rows
        const formRow = document.createElement('div');
        formRow.classList.add(FORM_ROW);
        
        //Create custom component for displaying the match candidates
        let divFormRow = formRow.cloneNode();
        divFormRow.classList.add(MATCH_CAND)

        this.#selectCandForm.appendChild(divFormRow);

        //Create a form row for the buttons
        divFormRow = formRow.cloneNode();
        divFormRow.classList.add('select-back');

        let button = getButtonElement(BTN_SELECT, 'select', 'Select');

        //button.addEventListener('click', this.#submitClick);

        divFormRow.appendChild(button);

        button = getButtonElement(BTN_BACK, 'back', 'Back');

        //button.addEventListener('click', this.#resetClick);

        divFormRow.appendChild(button);

        this.#selectCandForm.appendChild(divFormRow);

        //Add the top most div to the shadow root
        this.shadowRoot.appendChild(this.#b2bSelectCand);
    }

    //When the component is removed from the DOM, clean up references
    disconnectedCallback() {
    }

    //Render the component's content based on the current 'id' attribute
    renderComponentUpdate() {
        //Establish the number of candidates
        const numCands = this.#leiMatchCands?.data?.length;

        if(!numCands) {
            const divMatchCand = this.#selectCandForm.querySelector(`.${MATCH_CAND}`);

            if(divMatchCand) divMatchCand.textContent = 'No candidates available';

            return;
        }

        //New candidates available, 1st remove any existing match candidates
        this.#selectCandForm.querySelectorAll(`.${MATCH_CAND}`).forEach(formRowMC => formRowMC.remove());

        //All input elements are laid out in rows
        const formRow = document.createElement('div');
        formRow.classList.add(FORM_ROW);

        //Iterate from last to first & prepend
        for(let i = this.#leiMatchCands.data.length - 1; i >= 0; i--) {
            const leiRec = new LeiRec(this.#leiMatchCands, i);

            const rptSectionNames = new RptSection( 'Name(s)', 
                    [
                        new LabelArrValues( 'Name', leiRec.entity.legalName.name ),
                        new LabelArrValues( 'Other name(s)', leiRec.entity.otherNames.map(elem => elem.name) ),
                        new LabelArrValues( 'Transliterated name(s)', leiRec.entity.transliteratedOtherNames.map(elem => elem.name) )
                    ]
                );

            const rptSectionAddrs = new RptSection( 'Address', 
                    [
                        new LabelArrValues( 'Legal address', leiRec.entity.legalAddr.toArr() ),
//                        new LabelArrValues( 'HQ address', leiRec.entity.hqAddr.toArr() ),
//                        new LabelArrValues( 'Other address(es)', leiRec.entity.otherAddresses.map(elem => elem.toArr()) )
                    ]
                );

            //Create a form row for a match candidate
            const divFormRow = formRow.cloneNode();
            divFormRow.classList.add(MATCH_CAND);

            //Add the row as the 1st sibling
            this.#selectCandForm.prepend(divFormRow);

            const inpRadioBtn = document.createElement('input');
            inpRadioBtn.type = 'radio';
            inpRadioBtn.name = LEI_KEY;
            inpRadioBtn.value = leiRec.attribs?.lei;

            divFormRow.appendChild(inpRadioBtn);

            const rptSectionsWrapper = document.createElement('div');
            rptSectionsWrapper.classList.add(RPT_SECTIONS_WRAPPER);
            divFormRow.appendChild(rptSectionsWrapper);

            rptSectionsWrapper.appendChild(rptSectionNames.domElems);
            rptSectionsWrapper.appendChild(rptSectionAddrs.domElems);
        }
    }
}

customElements.define('b2b-select-candidate', B2bSelectCand);
