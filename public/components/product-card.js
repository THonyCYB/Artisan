class ProductCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['product'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'product' && oldValue !== newValue) {
            this.product = JSON.parse(newValue);
            this.render();
        }
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.product) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    transition: transform 0.3s, box-shadow 0.3s;
                    overflow: hidden;
                }
                :host(:hover) {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                .card {
                    padding: 1rem;
                }
                .image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 4px;
                }
                .title {
                    font-size: 1.25rem;
                    font-weight: bold;
                    margin: 1rem 0 0.5rem;
                    color: #333;
                }
                .price {
                    font-size: 1.5rem;
                    color: #2c5282;
                    margin: 0.5rem 0;
                }
                .description {
                    color: #666;
                    margin: 0.5rem 0;
                    line-height: 1.5;
                }
                .actions {
                    display: flex;
                    gap: 1rem;
                    margin-top: 1rem;
                }
                button {
                    flex: 1;
                    padding: 0.75rem;
                    border: none;
                    border-radius: 4px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .add-to-cart {
                    background: #4299e1;
                    color: white;
                }
                .add-to-cart:hover {
                    background: #2b6cb0;
                }
                .view-details {
                    background: #edf2f7;
                    color: #2d3748;
                }
                .view-details:hover {
                    background: #e2e8f0;
                }
            </style>
            <div class="card">
                <img class="image" src="${this.product.image || '/images/placeholder.jpg'}" alt="${this.product.name}">
                <h3 class="title">${this.product.name}</h3>
                <p class="price">€${this.product.price.toFixed(2)}</p>
                <p class="description">${this.product.description}</p>
                <div class="actions">
                    <button class="add-to-cart">Add to Cart</button>
                    <button class="view-details" data-id="${this.product._id}">View Details</button>
                </div>
            </div>
        `;

        this.setupEventListeners();
    }

    setupEventListeners() {
        const addToCartBtn = this.shadowRoot.querySelector('.add-to-cart');
        const viewDetailsBtn = this.shadowRoot.querySelector('.view-details');

        addToCartBtn.addEventListener('click', () => {
            const event = new CustomEvent('add-to-cart', {
                bubbles: true,
                composed: true,
                detail: { product: this.product }
            });
            this.dispatchEvent(event);
        });

        viewDetailsBtn.addEventListener('click', () => {
            window.location.href = `/products/${this.product._id}`;
        });
    }
}

customElements.define('product-card', ProductCard);