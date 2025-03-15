export default class NotFound extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    text-align: center;
                    padding: 2rem;
                }
                h1 {
                    color: #e74c3c;
                }
            </style>
            <div class="not-found">
                <h1>404 - Page Not Found</h1>
                <p>The page you're looking for doesn't exist.</p>
                <a href="/" data-link>Return to Home</a>
            </div>
        `;
    }
}