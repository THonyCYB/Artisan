class ProductDetails extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const productId = window.location.pathname.split('/').pop();
        await this.fetchProductDetails(productId);
        this.render();
        this.setupEventListeners();
    }

    async fetchProductDetails(productId) {
        try {
            const response = await fetch(`/api/products/${productId}`);
            const data = await response.json();
            this.product = data.data.product;
        } catch (error) {
            console.error('Error fetching product details:', error);
            this.product = null;
        }
    }

    setupEventListeners() {
        const addToCartBtn = this.shadowRoot.querySelector('.add-to-cart');
        const quantityInput = this.shadowRoot.querySelector('#quantity');
        const customizationForm = this.shadowRoot.querySelector('.customization-form');

        if (addToCartBtn) {
            addToCartBtn.addEventListener('click', () => {
                const quantity = parseInt(quantityInput.value);
                const customization = {};
                const formData = new FormData(customizationForm);
                for (let [key, value] of formData.entries()) {
                    customization[key] = value;
                }

                this.addToCart(quantity, customization);
            });
        }

        const thumbnails = this.shadowRoot.querySelectorAll('.thumbnail');
        thumbnails.forEach(thumb => {
            thumb.addEventListener('click', () => {
                const mainImage = this.shadowRoot.querySelector('.main-image');
                mainImage.src = thumb.src;
            });
        });
    }

    async addToCart(quantity, customization) {
        try {
            const cartItem = {
                productId: this.product._id,
                quantity,
                customization
            };

            // Add to cart logic here
            const event = new CustomEvent('cart-updated', {
                detail: { action: 'add', item: cartItem }
            });
            window.dispatchEvent(event);

            // Show success message
            const message = this.shadowRoot.querySelector('.message');
            message.textContent = 'Product added to cart!';
            message.classList.add('success');
            setTimeout(() => {
                message.textContent = '';
                message.classList.remove('success');
            }, 3000);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    }

    render() {
        if (!this.product) {
            this.shadowRoot.innerHTML = `
                <div class="error">Product not found</div>
            `;
            return;
        }

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: var(--max-width);
                    margin: 0 auto;
                    padding: var(--spacing-lg) var(--spacing-sm);
                }
                .product-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: var(--spacing-lg);
                }
                @media (min-width: 768px) {
                    .product-grid {
                        grid-template-columns: 1fr 1fr;
                    }
                }
                .gallery {
                    position: relative;
                }
                .main-image {
                    width: 100%;
                    height: auto;
                    border-radius: var(--border-radius);
                    margin-bottom: var(--spacing-sm);
                }
                .thumbnails {
                    display: flex;
                    gap: var(--spacing-xs);
                    overflow-x: auto;
                    padding-bottom: var(--spacing-xs);
                }
                .thumbnail {
                    width: 80px;
                    height: 80px;
                    object-fit: cover;
                    border-radius: var(--border-radius);
                    cursor: pointer;
                    transition: opacity 0.3s;
                }
                .thumbnail:hover {
                    opacity: 0.8;
                }
                .product-info h1 {
                    font-size: 2rem;
                    margin-bottom: var(--spacing-sm);
                }
                .price {
                    font-size: 1.5rem;
                    color: var(--primary-dark);
                    margin-bottom: var(--spacing-md);
                }
                .description {
                    color: var(--text-light);
                    margin-bottom: var(--spacing-md);
                    line-height: 1.6;
                }
                .customization-form {
                    margin-bottom: var(--spacing-md);
                }
                .form-group {
                    margin-bottom: var(--spacing-sm);
                }
                .form-label {
                    display: block;
                    margin-bottom: var(--spacing-xs);
                    font-weight: 500;
                }
                .form-input {
                    width: 100%;
                    padding: var(--spacing-xs);
                    border: 1px solid var(--border-color);
                    border-radius: var(--border-radius);
                }
                .quantity-input {
                    width: 100px;
                }
                .add-to-cart {
                    width: 100%;
                    padding: var(--spacing-sm);
                    background-color: var(--primary-color);
                    color: white;
                    border: none;
                    border-radius: var(--border-radius);
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .add-to-cart:hover {
                    background-color: var(--primary-dark);
                }
                .message {
                    margin-top: var(--spacing-sm);
                    padding: var(--spacing-sm);
                    border-radius: var(--border-radius);
                    text-align: center;
                }
                .message.success {
                    background-color: #48bb78;
                    color: white;
                }
            </style>
            <div class="product-grid">
                <div class="gallery">
                    <img class="main-image" src="${this.product.images[0]}" alt="${this.product.name}">
                    <div class="thumbnails">
                        ${this.product.images.map(image => `
                            <img class="thumbnail" src="${image}" alt="${this.product.name}">
                        `).join('')}
                    </div>
                </div>
                <div class="product-info">
                    <h1>${this.product.name}</h1>
                    <div class="price">€${this.product.price.toFixed(2)}</div>
                    <p class="description">${this.product.description}</p>
                    
                    <form class="customization-form">
                        ${this.product.customization?.map(option => `
                            <div class="form-group">
                                <label class="form-label" for="${option.name}">${option.label}</label>
                                ${this.renderCustomizationInput(option)}
                            </div>
                        `).join('') || ''}
                        
                        <div class="form-group">
                            <label class="form-label" for="quantity">Quantity</label>
                            <input type="number" id="quantity" class="form-input quantity-input" value="1" min="1">
                        </div>
                    </form>
                    
                    <button class="add-to-cart">Add to Cart</button>
                    <div class="message"></div>
                </div>
            </div>
        `;
    }

    renderCustomizationInput(option) {
        switch (option.type) {
            case 'select':
                return `
                    <select name="${option.name}" class="form-input">
                        ${option.values.map(value => `
                            <option value="${value}">${value}</option>
                        `).join('')}
                    </select>
                `;
            case 'color':
                return `
                    <select name="${option.name}" class="form-input">
                        ${option.values.map(color => `
                            <option value="${color}">${color}</option>
                        `).join('')}
                    </select>
                `;
            case 'text':
                return `
                    <input type="text" name="${option.name}" class="form-input" placeholder="${option.placeholder || ''}">
                `;
            default:
                return '';
        }
    }
}

customElements.define('product-details', ProductDetails);
export default ProductDetails;