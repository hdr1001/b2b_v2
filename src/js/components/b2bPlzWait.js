/* ********************************************************************
//
// Business-to-business (B2B) application v2
// Application's waiting animation  
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

const cssB2bPlzWait = new URL('./css/b2bPlzWait.css', import.meta.url).href;

//A HTML5 B2B waiting animation custom component class
export default class B2bPlzWait extends HTMLElement {
    constructor() {
        super();

        //Create the component's shadow DOM tree 
        this.attachShadow({ mode: 'open' });
    }

    //When the component is added to the DOM, render its content
    connectedCallback() {
        //Create a link to the component's CSS file
        const css = document.createElement('link');
        css.setAttribute('rel', 'stylesheet');
        css.setAttribute('href', cssB2bPlzWait);

        this.shadowRoot.appendChild(css);

        //The div container for the waiting animation
        const b2bPlzWait = document.createElement('div');
        b2bPlzWait.id = 'top-plz-wait';

        //The wait animation title
        const plzWaitTitle = document.createElement('div');
        plzWaitTitle.classList.add('plz-wait-title');
        plzWaitTitle.innerHTML = 'One moment please ...';
    
        b2bPlzWait.appendChild(plzWaitTitle);

        //The wait animation container
        const divAnimation = document.createElement('div');
        divAnimation.classList.add('plz-wait-animation');

        for(let i = 0; i < 5; i++) {
            divAnimation.appendChild(document.createElement('div')).classList.add('plz-wait-box')
        }
        
        b2bPlzWait.appendChild(divAnimation);

        //Attach the waiting animation to the component's shadow DOM
        this.shadowRoot.appendChild(b2bPlzWait);
    }
}
