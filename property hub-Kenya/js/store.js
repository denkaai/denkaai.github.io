const Store = {
    // Keys
    USERS: 'ph_users',
    TENANTS: 'ph_tenants',
    PROPERTIES: 'ph_properties',
    UNITS: 'ph_units',
    PAYMENTS: 'ph_payments',
    MESSAGES: 'ph_messages',
    AUDIT_LOGS: 'ph_audit_logs',
    CURRENT_USER: 'ph_current_user',
    THEME: 'ph_theme',

    init() {
        const keys = [this.USERS, this.TENANTS, this.PROPERTIES, this.UNITS, this.PAYMENTS, this.MESSAGES, this.AUDIT_LOGS];
        keys.forEach(key => {
            if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify([]));
        });
    },

    // --- Helper for Data Access ---
    getData(key) {
        return JSON.parse(localStorage.getItem(key)) || [];
    },

    saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // --- User Operations ---
    register(userData) {
        const users = this.getData(this.USERS);
        if (users.find(u => u.email === userData.email)) {
            return { success: false, message: 'Email already registered' };
        }
        
        const user = {
            id: 'user_' + Date.now(),
            name: userData.fullname,
            email: userData.email,
            phone: userData.phone || '',
            role: userData.role, // landlord, tenant, admin
            password: userData.password, // In a real app, hash this
            created_at: new Date().toISOString()
        };

        users.push(user);
        this.saveData(this.USERS, users);

        // If tenant, create tenant entry
        if (user.role === 'tenant') {
            this.createTenantEntry(user.id);
        }

        this.logAction(user.id, 'REGISTER', { role: user.role });
        return { success: true, user };
    },

    login(email, password) {
        const users = this.getData(this.USERS);
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
            this.logAction(user.id, 'LOGIN');
            return { success: true, user };
        }
        return { success: false, message: 'Invalid credentials' };
    },

    logout() {
        const user = this.getCurrentUser();
        if (user) this.logAction(user.id, 'LOGOUT');
        localStorage.removeItem(this.CURRENT_USER);
    },

    getCurrentUser() {
        return JSON.parse(localStorage.getItem(this.CURRENT_USER));
    },

    // --- Tenant Operations ---
    createTenantEntry(userId) {
        const tenants = this.getData(this.TENANTS);
        tenants.push({
            user_id: userId,
            landlord_id: null,
            unit_id: null,
            status: 'pending_approval', // pending_approval, active, rejected, exit_requested, exited
            move_out_date: null
        });
        this.saveData(this.TENANTS, tenants);
    },

    getTenantInfo(userId) {
        const tenants = this.getData(this.TENANTS);
        return tenants.find(t => t.user_id === userId);
    },

    updateTenantStatus(userId, status, metadata = {}) {
        const tenants = this.getData(this.TENANTS);
        const index = tenants.findIndex(t => t.user_id === userId);
        if (index !== -1) {
            tenants[index] = { ...tenants[index], status, ...metadata };
            this.saveData(this.TENANTS, tenants);
            
            // If exited, mark unit as vacant
            if (status === 'exited' && tenants[index].unit_id) {
                this.updateUnitStatus(tenants[index].unit_id, 'vacant');
            }
            
            const currentUser = this.getCurrentUser();
            this.logAction(currentUser ? currentUser.id : 'SYSTEM', 'UPDATE_TENANT_STATUS', { tenant_id: userId, status });
            return true;
        }
        return false;
    },

    // --- Property & Unit Operations ---
    addProperty(landlordId, propertyData) {
        const properties = this.getData(this.PROPERTIES);
        const property = {
            id: 'prop_' + Date.now(),
            landlord_id: landlordId,
            name: propertyData.name,
            location: propertyData.location
        };
        properties.push(property);
        this.saveData(this.PROPERTIES, properties);
        this.logAction(landlordId, 'ADD_PROPERTY', { property_id: property.id });
        return property;
    },

    addUnit(propertyId, unitData) {
        const units = this.getData(this.UNITS);
        const unit = {
            id: 'unit_' + Date.now(),
            property_id: propertyId,
            unit_number: unitData.unit_number,
            rent_amount: unitData.rent_amount,
            status: 'vacant' // vacant, occupied
        };
        units.push(unit);
        this.saveData(this.UNITS, units);
        return unit;
    },

    updateUnitStatus(unitId, status) {
        const units = this.getData(this.UNITS);
        const index = units.findIndex(u => u.id === unitId);
        if (index !== -1) {
            units[index].status = status;
            this.saveData(this.UNITS, units);
        }
    },

    getLandlordData(landlordId) {
        const properties = this.getData(this.PROPERTIES).filter(p => p.landlord_id === landlordId);
        const propIds = properties.map(p => p.id);
        const units = this.getData(this.UNITS).filter(u => propIds.includes(u.property_id));
        const tenants = this.getData(this.TENANTS).filter(t => t.landlord_id === landlordId);
        
        return { properties, units, tenants };
    },

    // --- Messaging ---
    sendMessage(senderId, recipientId, message, type = 'general') {
        const messages = this.getData(this.MESSAGES);
        const msg = {
            id: 'msg_' + Date.now(),
            sender_id: senderId,
            recipient_id: recipientId,
            message,
            type,
            created_at: new Date().toISOString()
        };
        messages.push(msg);
        this.saveData(this.MESSAGES, messages);
        return msg;
    },

    getMessages(userId) {
        return this.getData(this.MESSAGES).filter(m => m.recipient_id === userId || m.sender_id === userId);
    },

    // --- Payments ---
    addPayment(paymentData) {
        const payments = this.getData(this.PAYMENTS);
        const payment = {
            id: 'pay_' + Date.now(),
            tenant_id: paymentData.tenant_id,
            unit_id: paymentData.unit_id,
            amount: paymentData.amount,
            status: 'paid',
            paid_at: new Date().toISOString(),
            receipt_url: paymentData.receipt_url || ''
        };
        payments.push(payment);
        this.saveData(this.PAYMENTS, payments);
        this.logAction(paymentData.tenant_id, 'PAYMENT', { amount: paymentData.amount });
        return payment;
    },

    // --- Audit Log ---
    logAction(userId, action, metadata = {}) {
        const logs = this.getData(this.AUDIT_LOGS);
        logs.push({
            id: 'log_' + Date.now(),
            user_id: userId,
            action,
            metadata,
            timestamp: new Date().toISOString()
        });
        this.saveData(this.AUDIT_LOGS, logs);
    }
};

Store.init();
export default Store;
