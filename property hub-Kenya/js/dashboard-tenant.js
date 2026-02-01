import Store from './store.js';
import { showToast } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = Store.getCurrentUser();
    if (!user || user.role !== 'tenant') {
        window.location.href = '../login/';
        return;
    }

    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
    
    // Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        Store.logout();
        window.location.href = '../';
    });

    renderDashboard();
});

function renderDashboard() {
    const user = Store.getCurrentUser();
    const tenantInfo = Store.getTenantInfo(user.id);
    
    if (!tenantInfo) return;

    renderStatusBanner(tenantInfo);
    
    if (!tenantInfo.unit_id) {
        document.getElementById('dashboard-content').style.display = 'none';
        document.getElementById('no-unit-message').style.display = 'block';
        return;
    }

    document.getElementById('dashboard-content').style.display = 'block';
    document.getElementById('no-unit-message').style.display = 'none';

    const unit = Store.getData(Store.UNITS).find(u => u.id === tenantInfo.unit_id);
    const property = Store.getData(Store.PROPERTIES).find(p => p.id === unit.property_id);
    const landlord = Store.getData(Store.USERS).find(u => u.id === tenantInfo.landlord_id);

    // Update UI
    document.getElementById('unit-name').textContent = unit.unit_number;
    document.getElementById('property-name').textContent = property.name;
    document.getElementById('rent-amount').textContent = `KES ${parseFloat(unit.rent_amount).toLocaleString()}`;
    document.getElementById('landlord-name').textContent = landlord ? landlord.name : 'Unknown';
    document.getElementById('lease-status').textContent = tenantInfo.status.replace('_', ' ').toUpperCase();

    renderPayments(user.id);
    renderMessages(user.id);
    updateCountdown();

    // Disable payment if not active
    const payBtn = document.getElementById('pay-rent-btn');
    if (tenantInfo.status !== 'active') {
        payBtn.disabled = true;
        payBtn.title = "Actions restricted until approved by landlord";
    } else {
        payBtn.onclick = () => window.location.href = '../payment/';
    }

    // Move-out request
    const exitBtn = document.getElementById('request-exit-btn');
    if (tenantInfo.status === 'exit_requested') {
        exitBtn.disabled = true;
        exitBtn.textContent = "Exit Request Pending";
    } else {
        exitBtn.onclick = () => {
            if (confirm('Are you sure you want to request move-out?')) {
                Store.updateTenantStatus(user.id, 'exit_requested');
                showToast('Move-out request sent to landlord');
                renderDashboard();
            }
        };
    }
}

function renderStatusBanner(tenantInfo) {
    const banner = document.getElementById('status-banner');
    banner.innerHTML = '';

    if (tenantInfo.status === 'pending_approval') {
        banner.innerHTML = `
            <div class="banner banner-warning">
                <i class="fas fa-clock fa-lg"></i>
                <div>
                    <strong>Status: Pending landlord approval.</strong>
                    <p style="font-size: 0.9rem; margin-top: 5px;">Some features will unlock once the landlord approves your stay.</p>
                </div>
            </div>
        `;
    } else if (tenantInfo.status === 'rejected') {
        banner.innerHTML = `
            <div class="banner banner-danger">
                <i class="fas fa-exclamation-triangle fa-lg"></i>
                <div>
                    <strong>Access Restricted: Your application was rejected.</strong>
                    <p style="font-size: 0.9rem; margin-top: 5px;">Please contact the landlord for more information.</p>
                </div>
            </div>
        `;
    }
}

function renderPayments(userId) {
    const payments = Store.getData(Store.PAYMENTS).filter(p => p.tenant_id === userId);
    const container = document.getElementById('payment-history-body');
    
    if (payments.length === 0) return;

    container.innerHTML = payments.map(p => `
        <tr>
            <td>${new Date(p.paid_at).toLocaleDateString()}</td>
            <td style="font-family: monospace; font-size: 0.8rem;">${p.id}</td>
            <td>KES ${parseFloat(p.amount).toLocaleString()}</td>
            <td><span class="status-badge status-paid">Paid</span></td>
        </tr>
    `).join('');
}

function renderMessages(userId) {
    const messages = Store.getMessages(userId);
    const container = document.getElementById('messages-container');
    const msgCount = document.getElementById('msg-count');
    const users = Store.getData(Store.USERS);
    
    if (messages.length === 0) return;

    msgCount.textContent = `${messages.length} Total`;
    container.innerHTML = messages.map(m => {
        const isOutgoing = m.sender_id === userId;
        const otherPartyId = isOutgoing ? m.recipient_id : m.sender_id;
        const otherUser = users.find(u => u.id === otherPartyId);

        return `
            <div style="padding: 15px; border-bottom: 1px solid var(--border-light); margin-bottom: 10px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <div style="display: flex; gap: 8px; align-items: center;">
                        <strong style="color: var(--primary); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px;">${m.type}</strong>
                        <span class="status-badge" style="background: ${isOutgoing ? 'var(--primary)' : 'var(--accent)'}; color: white; font-size: 0.6rem; padding: 2px 6px;">
                            ${isOutgoing ? 'SENT' : 'FROM LANDLORD'}
                        </span>
                    </div>
                    <span style="font-size: 0.7rem; color: var(--text-muted-light);">${new Date(m.created_at).toLocaleString()}</span>
                </div>
                <p style="font-size: 0.95rem; margin-bottom: 5px;">${m.message}</p>
                <p style="font-size: 0.75rem; color: var(--text-muted-light);">
                    ${isOutgoing ? 'To' : 'From'}: <strong>${otherUser ? otherUser.name : 'System'}</strong>
                </p>
            </div>
        `;
    }).reverse().join('');
}

function updateCountdown() {
    // Mock countdown to next month 5th
    const now = new Date();
    let nextDue = new Date(now.getFullYear(), now.getMonth(), 5);
    if (now.getDate() > 5) nextDue.setMonth(nextDue.getMonth() + 1);

    const diff = nextDue - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    document.getElementById('due-timer').textContent = `${days}d : ${hours}h`;
    document.getElementById('due-date').textContent = `Due: ${nextDue.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
}
