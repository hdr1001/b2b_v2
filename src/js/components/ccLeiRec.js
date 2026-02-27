import { LEIs } from '../../assets/data/LEIs.js';
import LeiRec from '../gleif/leiRec.js';

export class CustCompLeiRec extends HTMLElement {
    static get observedAttributes() {
        return ['idx'];
    }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        this.idx = this.getAttribute('idx') || 1;
        this.leiRec = new LeiRec(LEIs[this.idx]);
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <section class="lei-rec">
                <pre>
                    ${this.leiRec.toString()}
                </pre>
            </section>
        `;

    }
}
