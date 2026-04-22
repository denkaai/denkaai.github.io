import Store from './store.js';
import { playSuccessSound, triggerCoinAnimation } from './notifications.js';

export default function init() {
    const user = Store.getCurrentUser();
    if (!user || user.role !== 'tenant') {
        window.location.href = '../login/';
        return;
    }

    const tenantInfo = Store.getTenantInfo(user.id);
    if (!tenantInfo || !tenantInfo.unit_id) {
        alert('No unit assigned or payment due');
        window.location.href = '../tenant/';
        return;
    }

    const unit = Store.getData(Store.UNITS).find(u => u.id === tenantInfo.unit_id);
    const property = Store.getData(Store.PROPERTIES).find(p => p.id === unit.property_id);
    const landlord = Store.getData(Store.USERS).find(u => u.id === tenantInfo.landlord_id);

    // Update UI
    const payPropEl = document.getElementById('pay-prop');
    if (payPropEl) {
        payPropEl.textContent = property.name;
        document.getElementById('pay-unit').textContent = unit.unit_number;
        document.getElementById('pay-landlord').textContent = landlord ? landlord.name : 'Unknown';
        document.getElementById('pay-amount').textContent = `KES ${parseFloat(unit.rent_amount).toLocaleString()}`;

        document.getElementById('start-payment-btn').addEventListener('click', () => {
            makePayment(user, property, unit);
        });
    }
}

// Support for traditional non-SPA loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

function makePayment(user, property, unit) {
    // Flutterwave Standard Checkout
    FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-515a458992f085732168923058863f58-X", // Example test key
        tx_ref: "PH-" + Date.now(),
        amount: unit.rent_amount,
        currency: "KES",
        payment_options: "card, mpesa, account",
        callback: function (payment) {
            if (payment.status === "successful") {
                Store.addPayment({
                    tenant_id: user.id,
                    unit_id: unit.id,
                    amount: payment.amount
                });
                playSuccessSound();
                triggerCoinAnimation();
                document.getElementById('success-modal').classList.add('active');
            }
        },
        onclose: function() {
            console.log("Payment closed");
        },
        customizations: {
            title: "PropertyHub KE",
            description: `Rent for ${property.name} - Unit ${unit.unit_number}`,
            logo: "https://via.placeholder.com/150",
        },
    });
}
