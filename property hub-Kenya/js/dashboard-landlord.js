import Store from './store.js';
import { showToast } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = Store.getCurrentUser();
    if (!user || user.role !== 'landlord') {
        window.location.href = '../login/';
        return;
    }

    document.getElementById('user-name').textContent = `Welcome, ${user.name}`;
    
    // Sidebar Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.dashboard-view');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetViewId = `view-${item.id.replace('nav-', '')}`;
            
            // Update Active Nav
            navItems.forEach(ni => {
                ni.classList.remove('btn-primary');
                ni.classList.add('btn-outline');
                ni.style.border = 'none';
            });
            item.classList.remove('btn-outline');
            item.classList.add('btn-primary');
            item.style.border = 'initial';

            // Switch View
            views.forEach(v => v.style.display = 'none');
            const targetView = document.getElementById(targetViewId);
            if (targetView) targetView.style.display = 'block';

            if (targetViewId === 'view-messages') renderMessagesSection();
        });
    });

    // Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        Store.logout();
        window.location.href = '../';
    });

    // Add Property Logic
    const addPropForm = document.getElementById('add-property-form');
    if (addPropForm) {
        addPropForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('prop-name').value;
            const location = document.getElementById('prop-location').value;
            
            Store.addProperty(user.id, { name, location });
            closeModal('property-modal');
            showToast('Property added successfully');
            renderDashboard();
            addPropForm.reset();
        });
    }

    // Send Message Logic
    const sendMsgForm = document.getElementById('send-message-form');
    if (sendMsgForm) {
        sendMsgForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const recipientId = document.getElementById('msg-recipient').value;
            const type = document.getElementById('msg-type').value;
            const message = document.getElementById('msg-content').value;
            
            if (recipientId === 'broadcast') {
                const data = Store.getLandlordData(user.id);
                const uniqueTenantIds = [...new Set(data.tenants.map(t => t.user_id))];
                uniqueTenantIds.forEach(tId => {
                    Store.sendMessage(user.id, tId, message, type);
                });
                showToast(`Broadcast sent to ${uniqueTenantIds.length} tenants`);
            } else {
                Store.sendMessage(user.id, recipientId, message, type);
                showToast('Message sent successfully');
            }

            closeModal('message-modal');
            renderMessagesSection();
            sendMsgForm.reset();
        });
    }

    renderDashboard();
    populateRecipients();
});

function renderDashboard() {
    renderStats();
    renderRequests();
    renderProperties();
    populateRecipients();
}

function populateRecipients() {
    const user = Store.getCurrentUser();
    const data = Store.getLandlordData(user.id);
    const select = document.getElementById('msg-recipient');
    if (!select) return;

    // Reset but keep broadcast
    select.innerHTML = '<option value="broadcast">All Tenants (Broadcast)</option>';
    
    const uniqueTenantIds = [...new Set(data.tenants.map(t => t.user_id))];
    const users = Store.getData(Store.USERS);

    uniqueTenantIds.forEach(tId => {
        const tenantUser = users.find(u => u.id === tId);
        if (tenantUser) {
            const option = document.createElement('option');
            option.value = tId;
            option.textContent = tenantUser.name;
            select.appendChild(option);
        }
    });
}

function renderMessagesSection() {
    const user = Store.getCurrentUser();
    const messages = Store.getMessages(user.id);
    const container = document.getElementById('messages-list-container');
    const users = Store.getData(Store.USERS);

    if (messages.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-muted-light); padding: 40px;">No message history found.</p>';
        return;
    }

    container.innerHTML = messages.map(m => {
        const isOutgoing = m.sender_id === user.id;
        const otherPartyId = isOutgoing ? m.recipient_id : m.sender_id;
        const otherUser = users.find(u => u.id === otherPartyId);
        
        return `
            <div style="padding: 20px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <div style="display: flex; gap: 10px; align-items: center; margin-bottom: 8px;">
                        <span class="status-badge" style="background: ${isOutgoing ? 'var(--primary)' : 'var(--accent)'}; color: white; font-size: 0.7rem;">
                            ${isOutgoing ? 'SENT' : 'RECEIVED'}
                        </span>
                        <strong style="color: var(--primary); text-transform: uppercase; font-size: 0.7rem; letter-spacing: 1px;">${m.type}</strong>
                        <span style="font-size: 0.7rem; color: var(--text-muted-light);">${new Date(m.created_at).toLocaleString()}</span>
                    </div>
                    <p style="font-size: 1rem; margin-bottom: 5px;">${m.message}</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted-light);">
                        ${isOutgoing ? 'To' : 'From'}: <strong>${otherUser ? otherUser.name : 'Unknown'}</strong>
                    </p>
                </div>
            </div>
        `;
    }).reverse().join('');
}

function renderStats() {
    const user = Store.getCurrentUser();
    const data = Store.getLandlordData(user.id);
    const payments = Store.getData(Store.PAYMENTS);
    
    const totalUnits = data.units.length;
    const occupiedUnits = data.units.filter(u => u.status === 'occupied').length;
    
    let collected = 0;
    let overdue = 0;
    
    // Simple logic: sum all payments related to this landlord's units
    const unitIds = data.units.map(u => u.id);
    payments.forEach(p => {
        if (unitIds.includes(p.unit_id)) {
            collected += parseFloat(p.amount);
        }
    });

    document.getElementById('occupancy-rate').textContent = `${occupiedUnits}/${totalUnits}`;
    document.getElementById('collected-rent').textContent = `KES ${collected.toLocaleString()}`;
    document.getElementById('overdue-rent').textContent = `KES ${overdue.toLocaleString()}`;
    
    const pendingRequests = data.tenants.filter(t => t.status === 'pending_approval' || t.status === 'exit_requested');
    document.getElementById('pending-count').textContent = pendingRequests.length;
}

function renderRequests() {
    const user = Store.getCurrentUser();
    const data = Store.getLandlordData(user.id);
    const pending = data.tenants.filter(t => t.status === 'pending_approval' || t.status === 'exit_requested');
    const container = document.getElementById('requests-container');
    const section = document.getElementById('requests-section');

    if (pending.length === 0) {
        section.style.display = 'none';
        return;
    }

    section.style.display = 'block';
    container.innerHTML = pending.map(req => {
        const tenantUser = Store.getData(Store.USERS).find(u => u.id === req.user_id);
        const isMoveOut = req.status === 'exit_requested';
        
        return `
            <div class="request-card glass ${isMoveOut ? 'moveout' : ''}">
                <div>
                    <h4 style="margin-bottom: 5px;">${isMoveOut ? 'Move-out Request' : 'New Tenant Approval'}</h4>
                    <p style="font-size: 0.9rem; color: var(--text-muted-light);">
                        <strong>${tenantUser ? tenantUser.name : 'Unknown'}</strong> - ${tenantUser ? tenantUser.email : ''}
                    </p>
                </div>
                <div style="display: flex; gap: 10px;">
                    ${isMoveOut ? `
                        <button class="btn btn-primary btn-sm" onclick="handleRequest('${req.user_id}', 'exited')">Confirm Move-out</button>
                        <button class="btn btn-outline btn-sm" onclick="handleRequest('${req.user_id}', 'active')">Decline</button>
                    ` : `
                        <button class="btn btn-primary btn-sm" onclick="handleRequest('${req.user_id}', 'active')">Approve</button>
                        <button class="btn btn-outline btn-sm" onclick="handleRequest('${req.user_id}', 'rejected')">Reject</button>
                    `}
                </div>
            </div>
        `;
    }).join('');
}

function renderProperties() {
    const user = Store.getCurrentUser();
    const data = Store.getLandlordData(user.id);
    const container = document.getElementById('properties-container');
    
    if (data.properties.length === 0) return;

    container.innerHTML = data.properties.map(prop => {
        const propUnits = data.units.filter(u => u.property_id === prop.id);
        return `
            <div class="property-card glass">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div>
                        <h3 style="color: var(--primary);">${prop.name}</h3>
                        <p style="font-size: 0.9rem; color: var(--text-muted-light);"><i class="fas fa-map-marker-alt"></i> ${prop.location}</p>
                    </div>
                    <div class="status-badge status-paid">${propUnits.length} Units</div>
                </div>
                
                <div style="margin-top: 20px;">
                    <button class="btn btn-outline" style="width: 100%; font-size: 0.9rem;" onclick="viewUnits('${prop.id}')">
                        Manage Units & Tenants
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Global scope for onclick handlers
window.openModal = (id) => document.getElementById(id).classList.add('active');
window.closeModal = (id) => document.getElementById(id).classList.remove('active');

window.handleRequest = (userId, status) => {
    if (Store.updateTenantStatus(userId, status)) {
        showToast(`Tenant status updated to ${status}`);
        renderDashboard();
    }
};

window.viewUnits = (propId) => {
    const properties = Store.getData(Store.PROPERTIES);
    const prop = properties.find(p => p.id === propId);
    if (!prop) return;

    const allUnits = Store.getData(Store.UNITS).filter(u => u.property_id === propId);
    const allTenants = Store.getData(Store.TENANTS);

    const modalHtml = `
        <div id="unit-modal" class="modal active">
            <div class="modal-content glass">
                <div class="section-header">
                    <h3>Units - ${prop.name}</h3>
                    <button class="btn btn-outline" onclick="closeModal('unit-modal')">Close</button>
                </div>
                
                <form id="add-unit-form" style="display: grid; grid-template-columns: 1fr 1fr 1.5fr auto; gap: 10px; margin-bottom: 30px;">
                    <input type="text" id="unit-num" class="form-control" placeholder="Unit #" required>
                    <input type="number" id="unit-rent" class="form-control" placeholder="Rent" required>
                    <input type="email" id="unit-tenant-email" class="form-control" placeholder="Tenant Email (Optional)">
                    <button type="submit" class="btn btn-primary"><i class="fas fa-plus"></i></button>
                </form>

                <div style="overflow-x: auto;">
                    <table class="unit-list" style="width: 100%; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 1px solid var(--border-light);">
                                <th style="padding: 12px;">Unit</th>
                                <th style="padding: 12px;">Rent</th>
                                <th style="padding: 12px;">Status</th>
                                <th style="padding: 12px;">Tenant</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${allUnits.length === 0 ? '<tr><td colspan="4" style="text-align:center; padding: 20px;">No units added</td></tr>' : allUnits.map(u => {
                                const tenant = allTenants.find(t => t.unit_id === u.id);
                                const tenantUser = tenant ? Store.getData(Store.USERS).find(us => us.id === tenant.user_id) : null;
                                return `
                                    <tr style="border-bottom: 1px solid var(--border-light);">
                                        <td style="padding: 12px;">${u.unit_number}</td>
                                        <td style="padding: 12px;">KES ${parseFloat(u.rent_amount).toLocaleString()}</td>
                                        <td style="padding: 12px;"><span class="status-badge ${u.status === 'occupied' ? 'status-paid' : 'status-unpaid'}">${u.status}</span></td>
                                        <td style="padding: 12px;">${tenantUser ? tenantUser.name : '---'}</td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('add-unit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const unit_number = document.getElementById('unit-num').value;
        const rent_amount = document.getElementById('unit-rent').value;
        const tenantEmail = document.getElementById('unit-tenant-email').value;

        const unit = Store.addUnit(propId, { unit_number, rent_amount });
        
        if (tenantEmail) {
            const users = Store.getData(Store.USERS);
            const tenantUser = users.find(u => u.email === tenantEmail);
            if (tenantUser) {
                Store.updateTenantStatus(tenantUser.id, 'active', { 
                    unit_id: unit.id, 
                    landlord_id: Store.getCurrentUser().id 
                });
                Store.updateUnitStatus(unit.id, 'occupied');
            } else {
                showToast('Tenant with this email not found. Unit created as vacant.', 'error');
            }
        }

        document.getElementById('unit-modal').remove();
        viewUnits(propId);
        renderDashboard();
    });
};
