// Expense Tracker JavaScript
// This script handles all the logic for expense tracking, data storage, calculations, and UI updates

// DOM Elements
const expenseForm = document.getElementById('expense-form');
const amountInput = document.getElementById('amount');
const categorySelect = document.getElementById('category');
const customCategoryInput = document.getElementById('custom-category');
const dateInput = document.getElementById('date');
const totalSpentEl = document.getElementById('total-spent');
const monthlySpentEl = document.getElementById('monthly-spent');
const categoryCountEl = document.getElementById('category-count');
const categoryChart = document.getElementById('category-chart');
const insightsList = document.getElementById('insights-list');
const expenseItems = document.getElementById('expense-items');
const themeToggle = document.querySelector('.theme-toggle');
const coinAnimation = document.getElementById('coin-animation');

// Income Elements
const incomeForm = document.getElementById('income-form');
const incomeAmountInput = document.getElementById('income-amount');
const incomeSourceInput = document.getElementById('income-source');
const incomeDateInput = document.getElementById('income-date');
const totalIncomeEl = document.getElementById('total-income');
const netBalanceEl = document.getElementById('net-balance');

// Budget Elements
const budgetForm = document.getElementById('budget-form');
const budgetCategorySelect = document.getElementById('budget-category');
const budgetAmountInput = document.getElementById('budget-amount');
const budgetListEl = document.getElementById('budget-list');

// Filter Elements
const searchInput = document.getElementById('search');
const startDateInput = document.getElementById('start-date');
const endDateInput = document.getElementById('end-date');
const applyFiltersBtn = document.getElementById('apply-filters');
const clearFiltersBtn = document.getElementById('clear-filters');

// Export Elements
const exportCsvBtn = document.getElementById('export-csv');
const exportPdfBtn = document.getElementById('export-pdf');
const backupDataBtn = document.getElementById('backup-data');
const restoreDataBtn = document.getElementById('restore-data');
const restoreFileInput = document.getElementById('restore-file');

// Currency and Recurring
const currencySelect = document.getElementById('currency-select');
const recurringSelect = document.getElementById('recurring');

// M-Pesa and Monetization Elements
const donateBtn = document.getElementById('donate-btn');
const mpesaSmsInput = document.getElementById('mpesa-sms-input');
const syncMpesaBtn = document.getElementById('sync-mpesa-btn');

// Chart variable
let expenseChart;

// Audio context for sound notifications
let audioContext;

function initAudio() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
}

function playSuccessSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime); // A5
    oscillator.frequency.exponentialRampToValueAtTime(1320, audioContext.currentTime + 0.1); // E6

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.3);
}

function playWarningSound() {
    initAudio();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // A4
    oscillator.frequency.exponentialRampToValueAtTime(220, audioContext.currentTime + 0.2); // A3

    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadExpenses();
    loadIncomes();
    loadBudgets();
    updateUI();
    setDefaultDate();
    setupThemeToggle();
    setupEventListeners();
    initializeChart();
});

// Set default date to today
function setDefaultDate() {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    if (incomeDateInput) incomeDateInput.value = today;
}

// Setup Event Listeners
function setupEventListeners() {
    if (incomeForm) {
        incomeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addIncome();
        });
    }

    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            addBudget();
        });
    }

    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', updateUI);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            searchInput.value = '';
            startDateInput.value = '';
            endDateInput.value = '';
            updateUI();
        });
    }

    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportToCSV);
    if (backupDataBtn) backupDataBtn.addEventListener('click', backupData);
    if (restoreDataBtn) restoreDataBtn.addEventListener('click', () => restoreFileInput.click());
    if (restoreFileInput) restoreFileInput.addEventListener('change', restoreData);

    if (currencySelect) {
        currencySelect.addEventListener('change', updateUI);
    }

    if (donateBtn) donateBtn.addEventListener('click', handleDonation);
    if (syncMpesaBtn) syncMpesaBtn.addEventListener('click', syncMpesaTransaction);
}

// Initialize Chart
function initializeChart() {
    const ctx = document.getElementById('expense-chart');
    if (!ctx) return;

    expenseChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses by Category',
                data: [],
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Theme toggle functionality
function setupThemeToggle() {
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        themeToggle.innerHTML = newTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
        localStorage.setItem('theme', newTheme);
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.setAttribute('data-theme', savedTheme);
    themeToggle.innerHTML = savedTheme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

// Form submission
expenseForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addExpense();
});

// Add new expense
function addExpense() {
    const amount = parseFloat(amountInput.value);
    let category = categorySelect.value;
    const customCategory = customCategoryInput.value.trim();
    const date = dateInput.value;
    const recurring = recurringSelect.value;

    if (!amount || !date) return;

    // Use custom category if provided, otherwise use selected category
    if (customCategory) {
        category = customCategory;
    } else if (!category) {
        alert('Please select a category or enter a custom one.');
        return;
    }

    const expense = {
        id: Date.now(),
        amount,
        category,
        date,
        recurring
    };

    // Save to localStorage
    const expenses = getExpenses();
    expenses.push(expense);
    localStorage.setItem('expenses', JSON.stringify(expenses));

    // Reset form
    expenseForm.reset();
    setDefaultDate();

    // Update UI and trigger animation
    updateUI();
    triggerCoinAnimation(category);

    // Play success sound
    playSuccessSound();

    // Show success message (could be enhanced with a toast notification)
    alert('Expense added successfully!');
}

// Get expenses from localStorage
function getExpenses() {
    return JSON.parse(localStorage.getItem('expenses')) || [];
}

// Add new income
function addIncome() {
    const amount = parseFloat(incomeAmountInput.value);
    const source = incomeSourceInput.value.trim();
    const date = incomeDateInput.value;

    if (!amount || !source || !date) return;

    const income = {
        id: Date.now(),
        amount,
        source,
        date
    };

    const incomes = getIncomes();
    incomes.push(income);
    localStorage.setItem('incomes', JSON.stringify(incomes));

    incomeForm.reset();
    setDefaultDate();
    updateUI();
    playSuccessSound();
    alert('Income added successfully!');
}

// Get incomes from localStorage
function getIncomes() {
    return JSON.parse(localStorage.getItem('incomes')) || [];
}

// Load incomes
function loadIncomes() {
    const incomes = getIncomes();
    // This is mainly for summary, but could be listed if needed
}

// Delete income
function deleteIncome(id) {
    const incomes = getIncomes().filter(income => income.id !== id);
    localStorage.setItem('incomes', JSON.stringify(incomes));
    updateUI();
}

// Add new budget
function addBudget() {
    const category = budgetCategorySelect.value;
    const amount = parseFloat(budgetAmountInput.value);

    if (!category || !amount) return;

    const budgets = getBudgets();
    const existingBudgetIndex = budgets.findIndex(b => b.category === category);

    if (existingBudgetIndex > -1) {
        budgets[existingBudgetIndex].amount = amount;
    } else {
        budgets.push({ category, amount });
    }

    localStorage.setItem('budgets', JSON.stringify(budgets));
    budgetForm.reset();
    updateUI();
    alert('Budget set successfully!');
}

// Get budgets from localStorage
function getBudgets() {
    return JSON.parse(localStorage.getItem('budgets')) || [];
}

// Load budgets
function loadBudgets() {
    const budgets = getBudgets();
    const expenses = getExpenses();
    const currency = currencySelect ? currencySelect.value : 'KSh';
    
    budgetListEl.innerHTML = '';

    if (budgets.length === 0) {
        budgetListEl.innerHTML = '<p>No budgets set yet.</p>';
        return;
    }

    budgets.forEach(budget => {
        // Calculate current spending for this category this month
        const now = new Date();
        const spent = expenses
            .filter(e => e.category === budget.category && 
                   new Date(e.date).getMonth() === now.getMonth() && 
                   new Date(e.date).getFullYear() === now.getFullYear())
            .reduce((sum, e) => sum + e.amount, 0);

        const percentage = Math.min((spent / budget.amount) * 100, 100);
        const remaining = budget.amount - spent;
        
        const budgetEl = document.createElement('div');
        budgetEl.className = 'budget-item';
        budgetEl.innerHTML = `
            <div class="budget-info">
                <span>${capitalizeFirstLetter(budget.category)}</span>
                <span>${currency} ${spent.toLocaleString()} / ${currency} ${budget.amount.toLocaleString()}</span>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${percentage}%; background-color: ${percentage > 90 ? '#ef4444' : '#10b981'}"></div>
            </div>
            <div class="budget-footer">
                <small>${remaining >= 0 ? `${currency} ${remaining.toLocaleString()} left` : `${currency} ${Math.abs(remaining).toLocaleString()} over`}</small>
                <button class="delete-btn-sm" onclick="deleteBudget('${budget.category}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        budgetListEl.appendChild(budgetEl);
    });
}

// Delete budget
function deleteBudget(category) {
    const budgets = getBudgets().filter(b => b.category !== category);
    localStorage.setItem('budgets', JSON.stringify(budgets));
    updateUI();
}

// Export to CSV
function exportToCSV() {
    const expenses = getExpenses();
    if (expenses.length === 0) {
        alert('No expenses to export.');
        return;
    }

    const headers = ['Date', 'Category', 'Amount'];
    const csvRows = [headers.join(',')];

    expenses.forEach(e => {
        csvRows.push(`${e.date},${e.category},${e.amount}`);
    });

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pesaflow-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// Backup data
function backupData() {
    const data = {
        expenses: getExpenses(),
        incomes: getIncomes(),
        budgets: getBudgets(),
        theme: localStorage.getItem('theme') || 'light'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pesaflow-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// Restore data
function restoreData(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            if (data.expenses) localStorage.setItem('expenses', JSON.stringify(data.expenses));
            if (data.incomes) localStorage.setItem('incomes', JSON.stringify(data.incomes));
            if (data.budgets) localStorage.setItem('budgets', JSON.stringify(data.budgets));
            if (data.theme) localStorage.setItem('theme', data.theme);
            
            updateUI();
            alert('Data restored successfully!');
        } catch (error) {
            alert('Error restoring data. Please ensure the file is a valid PesaFlow backup.');
        }
    };
    reader.readAsText(file);
}

// Monetization: Handle Donation with Flutterwave
function handleDonation() {
    FlutterwaveCheckout({
        public_key: "FLWPUBK_TEST-SANDBOX-SDK", // Replace with your actual Flutterwave public key
        tx_ref: "PF-" + Date.now(),
        amount: 500,
        currency: "KES",
        payment_options: "mpesa, card, ussd",
        customer: {
            email: "contact.denkaai@gmail.com",
            name: "PesaFlow Supporter",
        },
        customizations: {
            title: "Support PesaFlow",
            description: "One-time payment to support PesaFlow development",
            logo: "https://denkaai.github.io/assets/img/logo.png",
        },
        callback: function (data) {
            console.log(data);
            alert("Thank you for your support!");
        },
        onclose: function() {
            // close modal
        }
    });
}

// M-Pesa Sync: Parse SMS and add expense
function syncMpesaTransaction() {
    const sms = mpesaSmsInput.value.trim();
    if (!sms) return;

    // Basic regex to extract amount and recipient from M-Pesa SMS
    // Example: Ksh2,500.00 paid to ZUKU
    const amountMatch = sms.match(/Ksh([\d,]+\.\d{2})/);
    const recipientMatch = sms.match(/paid to ([^.]+)/) || sms.match(/sent to ([^.]+)/);

    if (amountMatch) {
        const amount = parseFloat(amountMatch[1].replace(/,/g, ''));
        const category = recipientMatch ? recipientMatch[1].trim() : 'M-Pesa';
        const date = new Date().toISOString().split('T')[0];

        const expense = {
            id: Date.now(),
            amount,
            category: category.toLowerCase(),
            date,
            recurring: 'none'
        };

        const expenses = getExpenses();
        expenses.push(expense);
        localStorage.setItem('expenses', JSON.stringify(expenses));

        mpesaSmsInput.value = '';
        updateUI();
        playSuccessSound();
        alert(`M-Pesa transaction of KSh ${amount} synced successfully!`);
    } else {
        alert('Could not parse M-Pesa SMS. Please ensure it follows the standard format.');
    }
}

// Load and display expenses
function loadExpenses() {
    let expenses = getExpenses();
    
    // Apply filters
    const searchTerm = searchInput.value.toLowerCase();
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;

    if (searchTerm) {
        expenses = expenses.filter(e => 
            e.category.toLowerCase().includes(searchTerm) || 
            e.amount.toString().includes(searchTerm)
        );
    }

    if (startDate) {
        expenses = expenses.filter(e => e.date >= startDate);
    }

    if (endDate) {
        expenses = expenses.filter(e => e.date <= endDate);
    }

    expenseItems.innerHTML = '';

    if (expenses.length === 0) {
        expenseItems.innerHTML = '<p>No expenses found.</p>';
        return;
    }

    // Sort by date (newest first)
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    expenses.forEach(expense => {
        const expenseEl = createExpenseElement(expense);
        expenseItems.appendChild(expenseEl);
    });
}

// Create expense list item
function createExpenseElement(expense) {
    const currency = currencySelect ? currencySelect.value : 'KSh';
    const div = document.createElement('div');
    div.className = 'expense-item';

    div.innerHTML = `
        <div class="expense-details">
            <div class="expense-amount">${currency} ${expense.amount.toLocaleString()}</div>
            <div class="expense-category">${capitalizeFirstLetter(expense.category)}</div>
            <div class="expense-date">${formatDate(expense.date)}</div>
            ${expense.recurring !== 'none' ? `<div class="expense-recurring"><i class="fas fa-redo"></i> ${capitalizeFirstLetter(expense.recurring)}</div>` : ''}
        </div>
        <button class="delete-btn" onclick="deleteExpense(${expense.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;

    return div;
}

// Delete expense
function deleteExpense(id) {
    const expenses = getExpenses().filter(expense => expense.id !== id);
    localStorage.setItem('expenses', JSON.stringify(expenses));
    updateUI();
}

// Update all UI elements
function updateUI() {
    loadExpenses();
    loadBudgets();
    updateSummary();
    updateCategoryBreakdown();
    updateInsights();
    updateChart();
}

// Update Chart
function updateChart() {
    if (!expenseChart) return;

    const expenses = getExpenses();
    const categories = {};

    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    const labels = Object.keys(categories).map(capitalizeFirstLetter);
    const data = Object.values(categories);

    expenseChart.data.labels = labels;
    expenseChart.data.datasets[0].data = data;
    expenseChart.update();
}

// Update summary cards
function updateSummary() {
    const expenses = getExpenses();
    const incomes = getIncomes();
    const currency = currencySelect ? currencySelect.value : 'KSh';
    
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
    const netBalance = totalIncome - totalExpenses;

    // Calculate this month's expenses
    const now = new Date();
    const thisMonth = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
    });
    const monthlyTotal = thisMonth.reduce((sum, expense) => sum + expense.amount, 0);

    // Count unique categories
    const uniqueCategories = new Set(expenses.map(expense => expense.category)).size;

    totalSpentEl.textContent = `${currency} ${totalExpenses.toLocaleString()}`;
    totalIncomeEl.textContent = `${currency} ${totalIncome.toLocaleString()}`;
    netBalanceEl.textContent = `${currency} ${netBalance.toLocaleString()}`;
    monthlySpentEl.textContent = `${currency} ${monthlyTotal.toLocaleString()}`;
    categoryCountEl.textContent = uniqueCategories;

    // Color net balance
    if (netBalance < 0) {
        netBalanceEl.style.color = '#ef4444';
    } else {
        netBalanceEl.style.color = '#10b981';
    }
}

// Update category breakdown
function updateCategoryBreakdown() {
    const expenses = getExpenses();
    const currency = currencySelect ? currencySelect.value : 'KSh';
    const categories = {};

    // Group expenses by category
    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    const total = Object.values(categories).reduce((sum, amount) => sum + amount, 0);

    categoryChart.innerHTML = '';

    if (Object.keys(categories).length === 0) {
        categoryChart.innerHTML = '<p>No expenses to display.</p>';
        return;
    }

    Object.entries(categories).forEach(([category, amount]) => {
        const percentage = ((amount / total) * 100).toFixed(1);
        const categoryEl = document.createElement('div');
        categoryEl.className = 'category-item';

        categoryEl.innerHTML = `
            <div>
                <div class="category-name">${capitalizeFirstLetter(category)}</div>
                <div class="category-percentage">${percentage}%</div>
            </div>
            <div class="category-amount">${currency} ${amount.toLocaleString()}</div>
        `;

        categoryChart.appendChild(categoryEl);
    });
}

// Update insights
function updateInsights() {
    const expenses = getExpenses();
    insightsList.innerHTML = '';

    if (expenses.length === 0) {
        insightsList.innerHTML = '<p>Add some expenses to see insights.</p>';
        return;
    }

    const insights = generateInsights(expenses);

    insights.forEach(insight => {
        const insightEl = document.createElement('div');
        insightEl.className = `insight-item ${insight.type}`;
        insightEl.textContent = insight.message;
        insightsList.appendChild(insightEl);
    });
}

// Generate financial insights
function generateInsights(expenses) {
    const insights = [];
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categories = {};

    // Group by category
    expenses.forEach(expense => {
        if (!categories[expense.category]) {
            categories[expense.category] = 0;
        }
        categories[expense.category] += expense.amount;
    });

    // Check for overspending categories
    Object.entries(categories).forEach(([category, amount]) => {
        const percentage = (amount / total) * 100;
        if (percentage > 40) {
            insights.push({
                type: 'warning',
                message: `${capitalizeFirstLetter(category)} is ${percentage.toFixed(1)}% of your total spending. Consider reducing expenses in this category.`
            });
            playWarningSound(); // Play warning sound for overspending
        }
    });

    // Check savings
    const savingsAmount = categories.savings || 0;
    const savingsPercentage = (savingsAmount / total) * 100;
    if (savingsPercentage < 10) {
        insights.push({
            type: 'danger',
            message: `You're saving only ${savingsPercentage.toFixed(1)}% of your income. Aim for at least 10-20% savings.`
        });
        playWarningSound(); // Play warning sound for low savings
    } else if (savingsPercentage >= 10) {
        insights.push({
            type: 'success',
            message: `Great job! You're saving ${savingsPercentage.toFixed(1)}% of your expenses.`
        });
    }

    // Check entertainment spending
    const entertainmentAmount = categories.entertainment || 0;
    const entertainmentPercentage = (entertainmentAmount / total) * 100;
    if (entertainmentPercentage > 20) {
        insights.push({
            type: 'warning',
            message: `Entertainment spending is ${entertainmentPercentage.toFixed(1)}% of your total. Consider balancing leisure with savings.`
        });
        playWarningSound(); // Play warning sound for high entertainment spending
    }

    // General positive insight
    if (insights.length === 0) {
        insights.push({
            type: 'success',
            message: 'Your spending looks balanced! Keep up the good work with tracking your expenses.'
        });
    }

    return insights;
}

// Trigger coin animation
function triggerCoinAnimation(category) {
    coinAnimation.style.display = 'block';

    // Position coin randomly on screen
    const x = Math.random() * (window.innerWidth - 100);
    const y = Math.random() * (window.innerHeight - 100);

    coinAnimation.style.left = `${x}px`;
    coinAnimation.style.top = `${y}px`;

    // Hide after animation
    setTimeout(() => {
        coinAnimation.style.display = 'none';
    }, 2000);
}

// Utility functions
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
