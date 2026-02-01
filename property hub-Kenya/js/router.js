import Store from './store.js';

const Router = {
    routes: {
        '/': 'index.html',
        '/login': 'login/index.html',
        '/register': 'register/index.html',
        '/landlord': 'landlord/index.html',
        '/tenant': 'tenant/index.html',
        '/payment': 'payment/index.html'
    },

    init() {
        window.addEventListener('popstate', () => this.handleRoute());
        document.body.addEventListener('click', e => {
            const link = e.target.closest('a');
            if (link && link.href.startsWith(window.location.origin) && !link.hasAttribute('data-no-router')) {
                e.preventDefault();
                const path = link.getAttribute('href').replace('../', '').replace('./', '');
                this.navigate(path);
            }
        });
        this.handleRoute();
    },

    navigate(path) {
        window.history.pushState({}, '', path);
        this.handleRoute();
    },

    async handleRoute() {
        const fullPath = window.location.pathname;
        // Handle various base paths (Vercel subfolder vs Root vs Local)
        let path = fullPath.replace('/propertyhub', '').replace('/property-hub-kenya', '').replace('/property hub-Kenya', '').replace(/\/$/, '') || '/';
        
        // Final fallback if the path is still absolute but should be relative to our known routes
        if (!this.routes[path] && path !== '/') {
            const possibleRoute = '/' + path.split('/').pop();
            if (this.routes[possibleRoute]) path = possibleRoute;
        }

        const template = this.routes[path] || this.routes['/'];
        
        try {
            // In a real SPA, we'd fetch partials. Here we might fetch the full page and extract <body>
            const response = await fetch(template);
            const html = await response.text();
            
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const newContent = doc.querySelector('main') || doc.body;
            
            // Update the main container
            const appContainer = document.getElementById('app') || document.body;
            appContainer.innerHTML = newContent.innerHTML;
            
            // Execute page specific logic
            this.initPageScripts(path);
            
            // Scroll to top
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Routing error:', error);
        }
    },

    initPageScripts(path) {
        // Trigger specific module logic based on path
        if (path.includes('login') || path.includes('register')) {
            import('./auth.js').then(m => m.default ? m.default() : null);
        } else if (path.includes('landlord')) {
            import('./dashboard-landlord.js').then(m => m.default ? m.default() : null);
        } else if (path.includes('tenant')) {
            import('./dashboard-tenant.js').then(m => m.default ? m.default() : null);
        } else if (path.includes('payment')) {
            import('./payment.js').then(m => m.default ? m.default() : null);
        }
    }
};

export default Router;
