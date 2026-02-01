/**
 * TimeGuard - Deadline Risk Predictor Logic
 * Algorithm: 
 * 1. Calculate days remaining until deadline.
 * 2. Calculate required hours per day: Total Hours / Days Remaining.
 * 3. Compare with user's daily availability.
 */

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskListEl = document.getElementById('task-list');
const totalTasksEl = document.getElementById('total-tasks');
const criticalTasksEl = document.getElementById('critical-tasks');
const clearAllBtn = document.getElementById('clear-all');
const themeToggle = document.querySelector('.theme-toggle');

// State
let tasks = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    setupThemeToggle();
    updateUI();
});

// Event Listeners
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask();
});

clearAllBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all analyzed tasks?')) {
        tasks = [];
        saveTasks();
        updateUI();
    }
});

function setupThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.body.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
}

function updateThemeIcon(theme) {
    themeToggle.innerHTML = theme === 'light' ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
}

function addTask() {
    const name = document.getElementById('task-name').value;
    const dueDate = document.getElementById('due-date').value;
    const estHours = parseFloat(document.getElementById('est-hours').value);
    const dailyHours = parseFloat(document.getElementById('daily-hours').value);

    const task = {
        id: Date.now(),
        name,
        dueDate,
        estHours,
        dailyHours,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    taskForm.reset();
    updateUI();
}

function calculateRisk(task) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadline = new Date(task.dueDate);
    deadline.setHours(0, 0, 0, 0);

    // Difference in days
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return { status: 'Overdue', level: 'critical', ratio: 0, daysLeft: diffDays };
    }

    // If deadline is today, daysLeft is 1 for calculation
    const daysLeft = diffDays === 0 ? 1 : diffDays;
    const requiredHoursPerDay = task.estHours / daysLeft;
    
    // Risk Ratio: Required / Available
    const ratio = requiredHoursPerDay / task.dailyHours;

    let status = 'Safe';
    let level = 'safe';

    if (ratio > 1.2) {
        status = 'Critical';
        level = 'critical';
    } else if (ratio > 0.8) {
        status = 'Warning';
        level = 'warning';
    }

    return {
        status,
        level,
        ratio: ratio.toFixed(2),
        required: requiredHoursPerDay.toFixed(1),
        daysLeft: diffDays
    };
}

function updateUI() {
    renderTasks();
    updateSummary();
}

function renderTasks() {
    if (tasks.length === 0) {
        taskListEl.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-hourglass-start"></i>
                <p>No tasks analyzed yet. Start by adding one above!</p>
            </div>
        `;
        return;
    }

    // Sort by newest
    const sortedTasks = [...tasks].sort((a, b) => b.id - a.id);
    
    taskListEl.innerHTML = '';
    sortedTasks.forEach(task => {
        const risk = calculateRisk(task);
        const card = document.createElement('div');
        card.className = `task-card risk-${risk.level}`;
        
        card.innerHTML = `
            <button class="delete-task" onclick="deleteTask(${task.id})">
                <i class="fas fa-times"></i>
            </button>
            <h3>${task.name}</h3>
            <div class="task-meta">
                <span><i class="far fa-calendar"></i> ${task.dueDate}</span>
                <span><i class="far fa-clock"></i> ${task.estHours}h total</span>
            </div>
            <div class="risk-indicator">
                <span class="label">Risk Level</span>
                <span class="risk-status color-${risk.level}">${risk.status}</span>
                <small>${risk.daysLeft} days left • ${risk.required}h / day req.</small>
            </div>
        `;
        taskListEl.appendChild(card);
    });
}

function updateSummary() {
    totalTasksEl.textContent = tasks.length;
    
    const criticalCount = tasks.filter(t => {
        const risk = calculateRisk(t);
        return risk.level === 'critical';
    }).length;

    criticalTasksEl.textContent = criticalCount;
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    updateUI();
}

function saveTasks() {
    localStorage.setItem('timeguard_tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const saved = localStorage.getItem('timeguard_tasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}
