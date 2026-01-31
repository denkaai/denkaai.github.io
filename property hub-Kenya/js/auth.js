import Store from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const result = Store.login(email, password);
            if (result.success) {
                redirectUser(result.user.role);
            } else {
                alert(result.message);
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullname = document.getElementById('fullname').value;
            const phone = document.getElementById('phone').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked').value;

            const result = Store.register({ fullname, phone, email, password, role });
            if (result.success) {
                Store.login(email, password);
                redirectUser(role);
            } else {
                alert(result.message);
            }
        });
    }
});

function redirectUser(role) {
    // Determine the base path (handle root vs subfolders)
    const isSubfolder = window.location.pathname.includes('/login/') || window.location.pathname.includes('/register/');
    const prefix = isSubfolder ? '../' : '';

    if (role === 'landlord') {
        window.location.href = prefix + 'landlord/';
    } else {
        window.location.href = prefix + 'tenant/';
    }
}

// Social Login Logic
window.socialLogin = (provider) => {
    console.log(`Initiating social login with: ${provider}`);
    alert(`Redirecting to ${provider} authentication...`);
    
    setTimeout(() => {
        const mockSocialUser = {
            fullname: `Social User (${provider})`,
            email: `social.${provider}@example.com`,
            phone: '0700000000',
            role: 'tenant',
            password: 'social-password'
        };
        
        const result = Store.register(mockSocialUser);
        if (result.success || result.message === 'Email already registered') {
            Store.login(mockSocialUser.email, 'social-password');
            const user = Store.getCurrentUser();
            redirectUser(user.role);
        }
    }, 1500);
};
