import Store from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = Store.getCurrentUser();
    if (!user || user.role !== 'tenant') {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('user-name').textContent = `Welcome, ${user.fullname}`;
    
    // Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        Store.logout();
        window.location.href = 'index.html';
    });

    loadTenantData(user);
});

function loadTenantData(user) {
    // ... same code ...
    const allProperties = JSON.parse(localStorage.getItem('ph_properties')) || [];
    let assignedUnit = null;
    let assignedProperty = null;

    allProperties.forEach(prop => {
        const unit = prop.units.find(u => u.tenantEmail === user.email);
        if (unit) {
            assignedUnit = unit;
            assignedProperty = prop;
        }
    });

    if (!assignedUnit) {
        document.getElementById('dashboard-content').style.display = 'none';
        document.getElementById('no-unit-message').style.display = 'block';
        return;
    }

    // Fill UI
    document.getElementById('unit-name').textContent = `Unit ${assignedUnit.number}`;
    document.getElementById('property-name').textContent = assignedProperty.name;
    document.getElementById('rent-amount').textContent = `KES ${parseFloat(assignedUnit.rent).toLocaleString()}`;
    
    startCountdown();
    // Render History
    renderHistory(user.email);
}

function startCountdown() {
    const timerElement = document.getElementById('due-timer');
    const dueDateElement = document.getElementById('due-date');
    
    // Set due date to 5th of next month for demo
    const now = new Date();
    const dueDate = new Date(now.getFullYear(), now.getMonth() + 1, 5);
    dueDateElement.textContent = `Due: ${dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

    const updateTimer = () => {
        const diff = dueDate - new Date();
        if (diff <= 0) {
            timerElement.textContent = "Overdue";
            return;
        }
        
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        timerElement.textContent = `${days}d : ${hours}h`;
    };

    updateTimer();
    setInterval(updateTimer, 3600000); // Update every hour
}

function renderHistory(email) {
    const payments = JSON.parse(localStorage.getItem('ph_payments')) || [];
    const tenantPayments = payments.filter(p => p.tenantEmail === email);
    const container = document.getElementById('payment-history-body');

    if (tenantPayments.length > 0) {
        container.innerHTML = tenantPayments.map(p => `
            <tr>
                <td>${new Date(p.timestamp).toLocaleDateString()}</td>
                <td><code style="font-size: 0.8rem;">${p.reference}</code></td>
                <td>KES ${parseFloat(p.amount).toLocaleString()}</td>
                <td><span class="status-badge status-paid">Confirmed</span></td>
            </tr>
        `).join('');
    }
}

window.openPayment = () => {
    window.location.href = 'payment.html';
};
