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

const cssB2bSelectCand = new URL('./css/b2bSelectCand.css', import.meta.url).href;

//Form related string constants
const FORM_ROW   = 'form-row';
const BTN_SELECT = 'select-cand';
const BTN_BACK   = 'select-back';


//A HTML5 B2B search criteria custom component class
export default class B2bSelectCand extends HTMLElement {
    #b2bSelectCand;  //Reference to the outermost div
    #selectCandForm; //Reference to the form element

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
        
        //Create a form row for the buttons
        let divFormRow = formRow.cloneNode();
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
}

customElements.define('b2b-select-candidate', B2bSelectCand);
