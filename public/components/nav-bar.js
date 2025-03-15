class NavBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        const isLoggedIn = localStorage.getItem('token');
        
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: #ffffff;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                nav {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 1rem;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .logo {
                    font-size: 1.5rem;
                    font-weight: bold;
                    text-decoration: none;
                    color: #333;
                }
                .nav-links {
                    display: flex;
                    gap: 1.5rem;
                    align-items: center;
                }
                a {
                    text-decoration: none;
                    color: #666;
                    transition: color 0.3s;
                }
                a:hover {
                    color: #333;
                }
                .cart-icon {
                    position: relative;
                }
                .cart-count {
                    position: absolute;
                    top: -8px;
                    right: -8px;
                    background: #ff4444;
                    color: white;
                    border-radius: 50%;
                    padding: 2px 6px;
                    font-size: 0.8rem;
                }
                @media (max-width: 768px) {
                    .nav-links {
                        gap: 1rem;
                    }
                }
            </style>
            <nav>
                <a href="/" class="logo" data-link>Artisan Platform</a>
                <div class="nav-links">
                    <a href="/products" data-link>Products</a>
                    ${isLoggedIn ? `
                        <a href="/dashboard" data-link>Dashboard</a>
                        <a href="#" class="logout">Logout</a>
                    ` : `
                        <a href="/login" data-link>Login</a>
                    `}
                    <a href="/cart" class="cart-icon" data-link>
                        Cart
                        <span class="cart-count">0</span>
                    </a>
                </div>
            </nav>
        `;
    }

    setupEventListeners() {
        const logoutButton = this.shadowRoot.querySelector('.logout');
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('token');
                window.location.href = '/';
            });
        }

        // Update cart count when cart changes
        window.addEventListener('cart-updated', (e) => {
            const cartCount = this.shadowRoot.querySelector('.cart-count');
            if (cartCount) {
                cartCount.textContent = e.detail.count;
            }
        });
    }
}

customElements.define('nav-bar', NavBar);