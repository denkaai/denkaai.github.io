document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('ph_theme') || 'light';

    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        if (themeToggle) themeToggle.checked = true;
    }

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            if (themeToggle.checked) {
                body.classList.add('dark-mode');
                localStorage.setItem('ph_theme', 'dark');
            } else {
                body.classList.remove('dark-mode');
                localStorage.setItem('ph_theme', 'light');
            }
        });
    }

    // Navbar Scroll Effect
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle (to be implemented if needed)
});

// Utility functions for UI
export const showToast = (message, type = 'success') => {
    // Basic toast implementation
    console.log(`[${type.toUpperCase()}] ${message}`);
    // In a real app, this would show a visual toast
};
