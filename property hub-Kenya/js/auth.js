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
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = document.querySelector('input[name="role"]:checked').value;

            const result = Store.register({ fullname, email, password, role });
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
    if (role === 'landlord') {
        window.location.href = 'landlord-dashboard.html';
    } else {
        window.location.href = 'tenant-dashboard.html';
    }
}
