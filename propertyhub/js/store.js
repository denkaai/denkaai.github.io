const Store = {
    // Keys
    USERS: 'ph_users',
    PROPERTIES: 'ph_properties',
    PAYMENTS: 'ph_payments',
    CURRENT_USER: 'ph_current_user',
    THEME: 'ph_theme',

    init() {
        if (!localStorage.getItem(this.USERS)) localStorage.setItem(this.USERS, JSON.stringify([]));
        if (!localStorage.getItem(this.PROPERTIES)) localStorage.setItem(this.PROPERTIES, JSON.stringify([]));
        if (!localStorage.getItem(this.PAYMENTS)) localStorage.setItem(this.PAYMENTS, JSON.stringify([]));
    },

    // User Operations
    register(userData) {
        const users = JSON.parse(localStorage.getItem(this.USERS));
        if (users.find(u => u.email === userData.email)) return { success: false, message: 'Email already registered' };
        
        userData.id = 'user_' + Date.now();
        users.push(userData);
        localStorage.setItem(this.USERS, JSON.stringify(users));
        return { success: true, user: userData };
    },

    login(email, password) {
        const users = JSON.parse(localStorage.getItem(this.USERS));
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    logout() {
        localStorage.removeItem(this.CURRENT_USER);
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER));
    },

    // Property Operations
    addProperty(landlordId, propertyData) {
        const properties = JSON.parse(localStorage.getItem(this.PROPERTIES));
        propertyData.id = 'prop_' + Date.now();
        propertyData.landlordId = landlordId;
        propertyData.units = propertyData.units || [];
        properties.push(propertyData);
        localStorage.setItem(this.PROPERTIES, JSON.stringify(properties));
        return propertyData;
    },

    getLandlordProperties(landlordId) {
        const properties = JSON.parse(localStorage.getItem(this.PROPERTIES));
        return properties.filter(p => p.landlordId === landlordId);
    },

    // Payment Operations
    addPayment(paymentData) {
        const payments = JSON.parse(localStorage.getItem(this.PAYMENTS));
        paymentData.id = 'pay_' + Date.now();
        paymentData.timestamp = new Date().toISOString();
        payments.push(paymentData);
        localStorage.setItem(this.PAYMENTS, JSON.stringify(payments));
        return paymentData;
    }
};

Store.init();
export default Store;
