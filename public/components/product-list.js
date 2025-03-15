class ProductList extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.products = [];
        this.filters = {
            search: '',
            category: 'all',
            minPrice: '',
            maxPrice: ''
        };
    }

    async connectedCallback() {
        await this.fetchProducts();
        this.render();
        this.setupEventListeners();
    }

    async fetchProducts() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            this.products = data.data.products;
        } catch (error) {
            console.error('Error fetching products:', error);
            this.products = [];
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 2rem;
                }
                .filters {
                    background: white;
                    padding: 1rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    margin-bottom: 2rem;
                }
                .filters-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1rem;
                    align-items: end;
                }
                .filter-group {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                label {
                    font-weight: bold;
                    color: #4a5568;
                }
                input, select {
                    padding: 0.5rem;
                    border: 1px solid #e2e8f0;
                    border-radius: 4px;
                    font-size: 1rem;
                }
                .products-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                    gap: 2rem;
                }
                .no-products {
                    text-align: center;
                    padding: 2rem;
                    color: #4a5568;
                    font-size: 1.2rem;
                }
                @media (max-width: 768px) {
                    .filters-grid {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            <div class="filters">
                <div class="filters-grid">
                    <div class="filter-group">
                        <label for="search">Search</label>
                        <input type="text" id="search" placeholder="Search products..." value="${this.filters.search}">
                    </div>
                    <div class="filter-group">
                        <label for="category">Category</label>
                        <select id="category">
                            <option value="all">All Categories</option>
                            <option value="furniture">Furniture</option>
                            <option value="ceramics">Ceramics</option>
                            <option value="textiles">Textiles</option>
                            <option value="jewelry">Jewelry</option>
                        </select>
                    </div>
                    <div class="filter-group">
                        <label for="min-price">Min Price</label>
                        <input type="number" id="min-price" placeholder="Min €" value="${this.filters.minPrice}">
                    </div>
                    <div class="filter-group">
                        <label for="max-price">Max Price</label>
                        <input type="number" id="max-price" placeholder="Max €" value="${this.filters.maxPrice}">
                    </div>
                </div>
            </div>
            <div class="products-grid">
                ${this.renderProducts()}
            </div>
        `;
    }

    renderProducts() {
        const filteredProducts = this.filterProducts();

        if (filteredProducts.length === 0) {
            return '<div class="no-products">No products found</div>';
        }

        return filteredProducts
            .map(product => `<product-card product='${JSON.stringify(product)}'></product-card>`)
            .join('');
    }

    filterProducts() {
        return this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(this.filters.search.toLowerCase()) ||
                                product.description.toLowerCase().includes(this.filters.search.toLowerCase());
            const matchesCategory = this.filters.category === 'all' || product.category === this.filters.category;
            const matchesMinPrice = !this.filters.minPrice || product.price >= parseFloat(this.filters.minPrice);
            const matchesMaxPrice = !this.filters.maxPrice || product.price <= parseFloat(this.filters.maxPrice);

            return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
        });
    }

    setupEventListeners() {
        const searchInput = this.shadowRoot.querySelector('#search');
        const categorySelect = this.shadowRoot.querySelector('#category');
        const minPriceInput = this.shadowRoot.querySelector('#min-price');
        const maxPriceInput = this.shadowRoot.querySelector('#max-price');

        const updateFilters = () => {
            this.filters = {
                search: searchInput.value,
                category: categorySelect.value,
                minPrice: minPriceInput.value,
                maxPrice: maxPriceInput.value
            };
            this.render();
        };

        searchInput.addEventListener('input', updateFilters);
        categorySelect.addEventListener('change', updateFilters);
        minPriceInput.addEventListener('input', updateFilters);
        maxPriceInput.addEventListener('input', updateFilters);
    }
}

customElements.define('product-list', ProductList);