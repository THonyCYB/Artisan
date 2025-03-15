// Initialize the application
import { router, initRoutes } from './router.js';
import './api.js';

// Initialize custom elements
customElements.define('nav-bar', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <nav>
                <a href="/" data-link>Home</a>
                <a href="/products" data-link>Products</a>
                <a href="/cart" data-link>Cart</a>
                <a href="/login" data-link>Login</a>
            </nav>
        `;
    }
});

customElements.define('footer-component', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <footer>
                <p>&copy; 2024 Artisan Platform. All rights reserved.</p>
            </footer>
        `;
    }
});

// Initialize router after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initRoutes().catch(console.error);
});