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
        // Detect base path dynamically
        const isGithubPages = window.location.hostname.includes('github.io');
        const basePath = isGithubPages ? '/propertyhub' : '';
        
        let path = window.location.pathname;
        if (basePath && path.startsWith(basePath)) {
            path = path.replace(basePath, '');
        }
        
        path = path.replace(/\/$/, '') || '/';
        
        // Match route or fallback to home
        const templateKey = this.routes[path] ? path : '/';
        const template = this.routes[templateKey];
        
        // Add loading state
        const appContainer = document.getElementById('app') || document.body;
        appContainer.classList.add('page-loading');
        
        try {
            const isLocalFile = window.location.protocol === 'file:';
            let fetchPath = isGithubPages ? `${basePath}/${template}` : `/${template}`;
            
            if (isLocalFile) {
                // For local files, we need relative paths
                const depth = window.location.pathname.split('/').length - (isGithubPages ? 3 : 2);
                const prefix = '../'.repeat(Math.max(0, depth));
                fetchPath = prefix + template;
            }
            
            const response = await fetch(fetchPath.replace('//', '/'));
            
            if (!response.ok) throw new Error(`Failed to load template: ${template}`);
            
            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            
            // Extract main content or body
            const newContent = doc.querySelector('main') || doc.body;
            
            // Update title
            document.title = doc.title || 'PropertyHub KE';
            
            // Update the container
            appContainer.innerHTML = newContent.innerHTML;
            appContainer.className = doc.body.className; // Sync body classes (like dark-mode)
            
            // Execute page specific logic
            this.initPageScripts(path);
            
            // Re-initialize global components (like theme toggle)
            window.dispatchEvent(new CustomEvent('page-changed', { detail: { path } }));
            
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Routing error:', error);
            // Fallback: if SPA fails, try a traditional redirect if not already on index
            if (path !== '/') window.location.href = isGithubPages ? `${basePath}/` : '/';
        } finally {
            appContainer.classList.remove('page-loading');
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
