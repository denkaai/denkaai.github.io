import Store from './store.js';

document.addEventListener('DOMContentLoaded', () => {
    const user = Store.getCurrentUser();
    if (!user || user.role !== 'landlord') {
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('user-name').textContent = `Welcome, ${user.fullname}`;
    
    // Logout Logic
    document.getElementById('logout-btn').addEventListener('click', () => {
        Store.logout();
        window.location.href = 'index.html';
    });

    // Add Property Logic
    const addPropForm = document.getElementById('add-property-form');
    if (addPropForm) {
        addPropForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('prop-name').value;
            const location = document.getElementById('prop-location').value;
            
            Store.addProperty(user.id, { name, location, units: [] });
            closeModal('property-modal');
            renderProperties();
            addPropForm.reset();
        });
    }

    renderProperties();
    updateStats();
});

function renderProperties() {
    const user = Store.getCurrentUser();
    const properties = Store.getLandlordProperties(user.id);
    const container = document.getElementById('properties-container');
    
    if (properties.length === 0) return;

    container.innerHTML = properties.map(prop => `
        <div class="property-card glass">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                <div>
                    <h3 style="color: var(--primary);">${prop.name}</h3>
                    <p style="font-size: 0.9rem; color: var(--text-muted-light);"><i class="fas fa-map-marker-alt"></i> ${prop.location}</p>
                </div>
                <div class="status-badge status-paid">${prop.units.length} Units</div>
            </div>
            
            <div style="margin-top: 20px;">
                <button class="btn btn-outline" style="width: 100%; font-size: 0.9rem;" onclick="viewUnits('${prop.id}')">
                    Manage Units & Tenants
                </button>
            </div>
        </div>
    `).join('');
}

function updateStats() {
    const user = Store.getCurrentUser();
    const properties = Store.getLandlordProperties(user.id);
    const allPayments = JSON.parse(localStorage.getItem('ph_payments')) || [];
    
    let totalExpected = 0;
    let totalCollected = 0;
    
    properties.forEach(p => {
        p.units.forEach(u => {
            if (u.tenantEmail) {
                totalExpected += parseFloat(u.rent || 0);
                
                // Find payments for this tenant
                const tenantPayments = allPayments.filter(pay => pay.tenantEmail === u.tenantEmail);
                tenantPayments.forEach(pay => {
                    totalCollected += parseFloat(pay.amount || 0);
                });
            }
        });
    });

    const outstanding = totalExpected - totalCollected;

    document.getElementById('expected-rent').textContent = `KES ${totalExpected.toLocaleString()}`;
    document.getElementById('collected-rent').textContent = `KES ${totalCollected.toLocaleString()}`;
    document.getElementById('outstanding-rent').textContent = `KES ${outstanding.toLocaleString()}`;
}

// Global scope for onclick handlers
window.openModal = (id) => document.getElementById(id).classList.add('active');
window.closeModal = (id) => document.getElementById(id).classList.remove('active');

window.viewUnits = (propId) => {
    const prop = (JSON.parse(localStorage.getItem('ph_properties')) || []).find(p => p.id === propId);
    if (!prop) return;

    const modalHtml = `
        <div id="unit-modal" class="modal active">
            <div class="modal-content glass" style="max-width: 800px;">
                <div class="section-header">
                    <h3>Manage Units - ${prop.name}</h3>
                    <button class="btn btn-outline" onclick="closeModal('unit-modal')">Close</button>
                </div>
                
                <form id="add-unit-form" style="display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 10px; margin-bottom: 20px;">
                    <input type="text" id="unit-num" class="form-control" placeholder="Unit #" required>
                    <input type="number" id="unit-rent" class="form-control" placeholder="Rent (KES)" required>
                    <input type="email" id="unit-tenant" class="form-control" placeholder="Tenant Email">
                    <button type="submit" class="btn btn-primary">Add Unit</button>
                </form>

                <div style="max-height: 400px; overflow-y: auto;">
                    <table class="unit-list">
                        <thead>
                            <tr>
                                <th>Unit</th>
                                <th>Rent</th>
                                <th>Tenant</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${prop.units.length === 0 ? '<tr><td colspan="4" style="text-align:center;">No units added yet</td></tr>' : prop.units.map(u => `
                                <tr>
                                    <td>${u.number}</td>
                                    <td>KES ${parseFloat(u.rent).toLocaleString()}</td>
                                    <td>${u.tenantEmail || 'Vacant'}</td>
                                    <td><span class="status-badge ${u.tenantEmail ? 'status-paid' : 'status-unpaid'}">${u.tenantEmail ? 'Occupied' : 'Vacant'}</span></td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('add-unit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const number = document.getElementById('unit-num').value;
        const rent = document.getElementById('unit-rent').value;
        const tenantEmail = document.getElementById('unit-tenant').value;

        const allProps = JSON.parse(localStorage.getItem('ph_properties'));
        const pIndex = allProps.findIndex(p => p.id === propId);
        allProps[pIndex].units.push({ number, rent, tenantEmail });
        localStorage.setItem('ph_properties', JSON.stringify(allProps));
        
        document.getElementById('unit-modal').remove();
        viewUnits(propId);
        renderProperties();
        updateStats();
    });
};

window.closeModal = (id) => {
    const modal = document.getElementById(id);
    if (id === 'unit-modal') {
        modal.remove();
    } else {
        modal.classList.remove('active');
    }
};
