class Router {
    constructor() {
        this.routes = new Map();
        this.init();
    }

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-link]')) {
                e.preventDefault();
                this.navigate(e.target.href);
            }
        });
    }

    addRoute(path, component) {
        this.routes.set(path, component);
    }

    async navigate(url) {
        const path = new URL(url).pathname;
        window.history.pushState(null, '', url);
        await this.handleRoute();
    }

    async handleRoute() {
        const path = window.location.pathname;
        const component = this.routes.get(path) || this.routes.get('*');
        
        if (component) {
            const app = document.getElementById('app');
            app.innerHTML = '';
            app.appendChild(new component());
        }
    }
}

export const router = new Router();
export const initRoutes = async () => {
    router.addRoute('/', (await import('../components/home-page.js')).default);
    router.addRoute('/login', (await import('../components/auth-form.js')).default);
    router.addRoute('/dashboard', (await import('../components/dashboard-page.js')).default);
    router.addRoute('/products', (await import('../components/product-list.js')).default);
    router.addRoute('/cart', (await import('../components/shopping-cart.js')).default);
    router.addRoute('*', (await import('../components/not-found.js')).default);
    
    // Initial route handling
    await router.handleRoute();
};