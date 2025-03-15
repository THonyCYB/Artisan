export default class HomePage extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        await this.fetchFeaturedProducts();
        this.render();
    }

    async fetchFeaturedProducts() {
        try {
            const response = await fetch('/api/products?featured=true');
            const data = await response.json();
            this.featuredProducts = data.data.products.slice(0, 4);
        } catch (error) {
            console.error('Error fetching featured products:', error);
            this.featuredProducts = [];
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                }
                .hero {
                    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero-bg.jpg');
                    background-size: cover;
                    background-position: center;
                    background-attachment: fixed;
                    color: white;
                    text-align: center;
                    padding: var(--spacing-lg) var(--spacing-sm);
                    min-height: 70vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }
                .hero-content {
                    max-width: var(--max-width);
                    margin: 0 auto;
                    position: relative;
                    z-index: 2;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeInUp 1s ease-out forwards;
                }

                @keyframes fadeInUp {
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .hero h1 {
                    font-size: 3rem;
                    margin-bottom: var(--spacing-md);
                }
                .hero p {
                    font-size: 1.25rem;
                    margin-bottom: var(--spacing-md);
                    max-width: 600px;
                    margin-left: auto;
                    margin-right: auto;
                }
                .section {
                    padding: var(--spacing-lg) var(--spacing-sm);
                    max-width: var(--max-width);
                    margin: 0 auto;
                }
                .section-title {
                    text-align: center;
                    margin-bottom: var(--spacing-lg);
                }
                .featured-products {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: var(--spacing-md);
                    margin-bottom: var(--spacing-lg);
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeInUp 1s ease-out 0.5s forwards;
                }
                .about-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-lg);
                    align-items: center;
                    opacity: 0;
                    transform: translateY(20px);
                    animation: fadeInUp 1s ease-out 0.8s forwards;
                }
                @media (min-width: 768px) {
                    .about-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                .about-content h2 {
                    margin-bottom: var(--spacing-md);
                }
                .about-content p {
                    margin-bottom: var(--spacing-sm);
                    color: var(--text-light);
                }
                .hero-buttons {
                    display: flex;
                    gap: var(--spacing-md);
                    justify-content: center;
                    margin-top: var(--spacing-lg);
                }
                .btn {
                    display: inline-block;
                    padding: var(--spacing-md) var(--spacing-lg);
                    background-color: var(--primary-color);
                    color: white;
                    text-decoration: none;
                    border-radius: var(--border-radius);
                    transition: all 0.3s ease;
                    font-weight: 600;
                    font-size: 1.1rem;
                    min-width: 180px;
                    text-align: center;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                }
                .btn:hover {
                    background-color: var(--primary-dark);
                    transform: translateY(-2px);
                    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
                }
                .btn-outline {
                    background-color: transparent;
                    border: 2px solid white;
                }
                .btn-outline:hover {
                    background-color: white;
                    color: var(--primary-color);
                }
            </style>
            <div class="hero">
                <div class="hero-content">
                    <h1>Welcome to Artisan Platform</h1>
                    <p>Discover unique handcrafted pieces from talented artisans around the world</p>
                    <div class="hero-buttons">
                        <a href="/products" class="btn" data-link>Explore Products</a>
                        <a href="/connect" class="btn btn-outline" data-link>Connect</a>
                        <a href="/become-artist" class="btn btn-outline" data-link>Become an Artist</a>
                    </div>
                </div>
            </div>

            <section class="section">
                <h2 class="section-title">Featured Products</h2>
                <div class="featured-products">
                    ${this.featuredProducts?.map(product => `
                        <product-card product='${JSON.stringify(product)}'></product-card>
                    `).join('') || ''}
                </div>
            </section>

            <section class="section">
                <div class="about-grid">
                    <div class="about-content">
                        <h2>About Artisan Platform</h2>
                        <p>We connect talented artisans with art enthusiasts worldwide, providing a platform for unique, handcrafted pieces that tell a story.</p>
                        <p>Our mission is to preserve traditional craftsmanship while embracing modern design, ensuring fair compensation for artisans and exceptional quality for collectors.</p>
                        <a href="/about" class="btn" data-link>Learn More</a>
                    </div>
                    <div class="about-image">
                        <img src="/images/about-artisan.jpg" alt="Artisan at work" style="width: 100%; border-radius: var(--border-radius);">
                    </div>
                </div>
            </section>
        `;
    }
}

customElements.define('home-page', HomePage);