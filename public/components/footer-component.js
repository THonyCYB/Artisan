class FooterComponent extends HTMLElement {
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
                    background-color: var(--secondary-color);
                    color: white;
                    padding: var(--spacing-lg) 0;
                }
                .footer-content {
                    max-width: var(--max-width);
                    margin: 0 auto;
                    padding: 0 var(--spacing-sm);
                }
                .footer-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: var(--spacing-lg);
                    margin-bottom: var(--spacing-lg);
                }
                .footer-section h3 {
                    color: white;
                    margin-bottom: var(--spacing-md);
                    font-size: 1.2rem;
                }
                .footer-links {
                    list-style: none;
                }
                .footer-links li {
                    margin-bottom: var(--spacing-xs);
                }
                .footer-links a {
                    color: #cbd5e0;
                    text-decoration: none;
                    transition: color 0.3s;
                }
                .footer-links a:hover {
                    color: white;
                }
                .social-links {
                    display: flex;
                    gap: var(--spacing-sm);
                }
                .social-links a {
                    color: #cbd5e0;
                    text-decoration: none;
                    transition: color 0.3s;
                }
                .social-links a:hover {
                    color: white;
                }
                .bottom-bar {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding-top: var(--spacing-md);
                    text-align: center;
                    color: #cbd5e0;
                    font-size: 0.9rem;
                }
            </style>
            <footer>
                <div class="footer-content">
                    <div class="footer-grid">
                        <div class="footer-section">
                            <h3>About Us</h3>
                            <ul class="footer-links">
                                <li><a href="/about" data-link>Our Story</a></li>
                                <li><a href="/artisans" data-link>Our Artisans</a></li>
                                <li><a href="/blog" data-link>Blog</a></li>
                                <li><a href="/careers" data-link>Careers</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Customer Service</h3>
                            <ul class="footer-links">
                                <li><a href="/contact" data-link>Contact Us</a></li>
                                <li><a href="/shipping" data-link>Shipping Information</a></li>
                                <li><a href="/returns" data-link>Returns & Exchanges</a></li>
                                <li><a href="/faq" data-link>FAQ</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Legal</h3>
                            <ul class="footer-links">
                                <li><a href="/privacy" data-link>Privacy Policy</a></li>
                                <li><a href="/terms" data-link>Terms of Service</a></li>
                                <li><a href="/cookies" data-link>Cookie Policy</a></li>
                            </ul>
                        </div>
                        <div class="footer-section">
                            <h3>Connect With Us</h3>
                            <div class="social-links">
                                <a href="https://facebook.com/artisanplatform" target="_blank" rel="noopener noreferrer">Facebook</a>
                                <a href="https://instagram.com/artisanplatform" target="_blank" rel="noopener noreferrer">Instagram</a>
                                <a href="https://twitter.com/artisanplatform" target="_blank" rel="noopener noreferrer">Twitter</a>
                                <a href="https://pinterest.com/artisanplatform" target="_blank" rel="noopener noreferrer">Pinterest</a>
                            </div>
                        </div>
                    </div>
                    <div class="bottom-bar">
                        <p>&copy; ${new Date().getFullYear()} Artisan Platform. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        `;
    }
}

customElements.define('footer-component', FooterComponent);
export default FooterComponent;