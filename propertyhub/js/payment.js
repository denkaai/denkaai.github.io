import Store from './store.js';
import { playSuccessSound, triggerCoinAnimation } from './notifications.js';

document.addEventListener('DOMContentLoaded', () => {
    // ... existing code ...
    const user = Store.getCurrentUser();
    if (!user || user.role !== 'tenant') {
        window.location.href = 'login.html';
        return;
    }

    const data = getPaymentData(user.email);
    if (!data) {
        alert('No payment due');
        window.location.href = 'tenant-dashboard.html';
        return;
    }

    // Update UI
    document.getElementById('pay-prop').textContent = data.prop.name;
    document.getElementById('pay-unit').textContent = data.unit.number;
    document.getElementById('pay-amount').textContent = `KES ${parseFloat(data.unit.rent).toLocaleString()}`;

    document.getElementById('start-payment-btn').addEventListener('click', () => {
        makePayment(user, data);
    });
});

function getPaymentData(email) {
    const allProperties = JSON.parse(localStorage.getItem('ph_properties')) || [];
    for (const prop of allProperties) {
        const unit = prop.units.find(u => u.tenantEmail === email);
        if (unit) return { prop, unit };
    }
    return null;
}

function makePayment(user, data) {
    // Flutterwave Standard Checkout
    FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-515a458992f085732168923058863f58-X", // Example test key
        tx_ref: "PH-" + Date.now(),
        amount: data.unit.rent,
        currency: "KES",
        payment_options: "card, mpesa, account",
        callback: function (payment) {
            if (payment.status === "successful") {
                savePayment(user.email, payment.amount, payment.tx_ref);
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
            description: `Rent for ${data.prop.name} - Unit ${data.unit.number}`,
            logo: "https://via.placeholder.com/150",
        },
    });
}

function savePayment(email, amount, ref) {
    const payments = JSON.parse(localStorage.getItem('ph_payments')) || [];
    payments.push({
        tenantEmail: email,
        amount: amount,
        reference: ref,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('ph_payments', JSON.stringify(payments));
}
