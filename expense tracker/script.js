// ===========================
// TRANSACTION MANAGER CLASS
// ===========================

class ExpenseTracker {
    constructor() {
        // Transaction storage
        this.transactions = [];
        this.editingId = null;

        // DOM Elements
        this.form = document.getElementById('transactionForm');
        this.typeInputs = document.querySelectorAll('input[name="type"]');
        this.amountInput = document.getElementById('amount');
        this.categorySelect = document.getElementById('category');
        this.dateInput = document.getElementById('date');
        this.descriptionInput = document.getElementById('description');
        this.submitBtn = document.getElementById('submitBtn');
        this.resetBtn = document.getElementById('resetBtn');

        // Summary elements
        this.totalIncomeEl = document.getElementById('totalIncome');
        this.totalExpensesEl = document.getElementById('totalExpenses');
        this.balanceEl = document.getElementById('balance');

        // Transaction container
        this.transactionsContainer = document.getElementById('transactionsContainer');
        this.emptyState = document.getElementById('emptyState');

        // Filter elements
        this.typeFilter = document.getElementById('typeFilter');
        this.categoryFilter = document.getElementById('categoryFilter');
        this.clearFiltersBtn = document.getElementById('clearFiltersBtn');

        // Toast
        this.toast = document.getElementById('toast');

        // Initialize
        this.init();
    }

    /**
     * Initialize the app
     */
    init() {
        // Set today's date as default and max
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
        this.dateInput.max = today; // Prevent selecting future dates in date picker

        // Load transactions from localStorage
        this.loadFromLocalStorage();

        // Render transactions
        this.renderTransactions();

        // Update summary
        this.updateSummary();

        // Update category filter
        this.updateCategoryFilter();

        // Event listeners
        this.attachEventListeners();
    }

    /**
     * Attach all event listeners
     */
    attachEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
        this.typeFilter.addEventListener('change', () => this.renderTransactions());
        this.categoryFilter.addEventListener('change', () => this.renderTransactions());
        this.clearFiltersBtn.addEventListener('click', () => this.clearFilters());
    }

    /**
     * Handle form submission
     */
    handleFormSubmit(e) {
        e.preventDefault();

        // Validate form
        if (!this.validateForm()) {
            return;
        }

        // Get form data
        const formData = this.getFormData();

        if (this.editingId) {
            // Update existing transaction
            this.editTransaction(this.editingId, formData);
            this.showToast('Transaction updated successfully!');
        } else {
            // Add new transaction
            this.addTransaction(formData);
            this.showToast('Transaction added successfully!');
        }

        // Reset form
        this.resetForm();
    }

    /**
     * Validate form inputs
     */
    validateForm() {
        let isValid = true;

        // Clear previous errors
        this.clearErrors();

        // Validate type
        const typeSelected = document.querySelector('input[name="type"]:checked');
        if (!typeSelected) {
            this.showError('typeError', 'Please select a type (Income or Expense)');
            isValid = false;
        }

        // Validate amount
        const amount = parseFloat(this.amountInput.value);
        if (!this.amountInput.value || isNaN(amount) || amount <= 0) {
            this.showError('amountError', 'Amount must be a positive number');
            this.amountInput.classList.add('error');
            isValid = false;
        }

        // Validate category
        if (!this.categorySelect.value) {
            this.showError('categoryError', 'Please select a category');
            this.categorySelect.classList.add('error');
            isValid = false;
        }

        // Validate date
        if (!this.dateInput.value) {
            this.showError('dateError', 'Please select a date');
            this.dateInput.classList.add('error');
            isValid = false;
        } else {
            // Check if date is in the future
            const selectedDate = new Date(this.dateInput.value + 'T00:00:00');
            const today = new Date();
            today.setHours(0, 0, 0, 0); // Reset time to start of day for fair comparison
            
            if (selectedDate > today) {
                this.showError('dateError', 'Date cannot be in the future. Please select today or an earlier date.');
                this.dateInput.classList.add('error');
                isValid = false;
            }
        }

        // Validate description
        if (!this.descriptionInput.value.trim()) {
            this.showError('descriptionError', 'Please enter a description');
            this.descriptionInput.classList.add('error');
            isValid = false;
        }

        return isValid;
    }

    /**
     * Show error message
     */
    showError(elementId, message) {
        const errorEl = document.getElementById(elementId);
        errorEl.textContent = message;
    }

    /**
     * Clear all error messages
     */
    clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        document.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
    }

    /**
     * Get form data
     */
    getFormData() {
        const type = document.querySelector('input[name="type"]:checked').value;
        return {
            type,
            amount: parseFloat(this.amountInput.value),
            category: this.categorySelect.value,
            date: this.dateInput.value,
            description: this.descriptionInput.value.trim()
        };
    }

    /**
     * Add new transaction
     */
    addTransaction(formData) {
        const transaction = {
            id: Date.now(), // Unique ID using timestamp
            ...formData,
            createdAt: new Date().toISOString()
        };

        this.transactions.unshift(transaction); // Add to beginning (newest first)
        this.saveToLocalStorage();
        this.updateCategoryFilter();
        this.renderTransactions();
        this.updateSummary();
    }

    /**
     * Edit existing transaction
     */
    editTransaction(id, formData) {
        const index = this.transactions.findIndex(t => t.id === id);
        if (index !== -1) {
            this.transactions[index] = {
                ...this.transactions[index],
                ...formData
            };
            this.saveToLocalStorage();
            this.updateCategoryFilter();
            this.renderTransactions();
            this.updateSummary();
        }
        this.editingId = null;
    }

    /**
     * Delete transaction with confirmation
     */
    deleteTransaction(id) {
        if (confirm('Are you sure you want to delete this transaction?')) {
            this.transactions = this.transactions.filter(t => t.id !== id);
            this.saveToLocalStorage();
            this.updateCategoryFilter();
            this.renderTransactions();
            this.updateSummary();
            this.showToast('Transaction deleted successfully!');
        }
    }

    /**
     * Load transaction into form for editing
     */
    loadTransactionForEdit(id) {
        const transaction = this.transactions.find(t => t.id === id);
        if (transaction) {
            this.editingId = id;

            // Set form values
            document.querySelector(`input[value="${transaction.type}"]`).checked = true;
            this.amountInput.value = transaction.amount;
            this.categorySelect.value = transaction.category;
            this.dateInput.value = transaction.date;
            this.descriptionInput.value = transaction.description;

            // Update button text
            this.submitBtn.textContent = 'Update Transaction';
            this.resetBtn.style.display = 'inline-block';

            // Scroll to form
            this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Reset form to initial state
     */
    resetForm() {
        this.form.reset();
        const today = new Date().toISOString().split('T')[0];
        this.dateInput.value = today;
        this.submitBtn.textContent = 'Add Transaction';
        this.resetBtn.style.display = 'none';
        this.editingId = null;
        this.clearErrors();
    }

    /**
     * Clear filters
     */
    clearFilters() {
        this.typeFilter.value = '';
        this.categoryFilter.value = '';
        this.renderTransactions();
    }

    /**
     * Get filtered transactions
     */
    getFilteredTransactions() {
        let filtered = this.transactions;

        // Filter by type
        const typeFilterValue = this.typeFilter.value;
        if (typeFilterValue) {
            filtered = filtered.filter(t => t.type === typeFilterValue);
        }

        // Filter by category
        const categoryFilterValue = this.categoryFilter.value;
        if (categoryFilterValue) {
            filtered = filtered.filter(t => t.category === categoryFilterValue);
        }

        return filtered;
    }

    /**
     * Render transactions to DOM
     */
    renderTransactions() {
        const filtered = this.getFilteredTransactions();

        // Clear container
        this.transactionsContainer.innerHTML = '';

        if (filtered.length === 0) {
            this.emptyState.classList.remove('hidden');
            return;
        }

        this.emptyState.classList.add('hidden');

        // Render each transaction
        filtered.forEach(transaction => {
            const row = document.createElement('div');
            row.className = 'transaction-row';
            row.innerHTML = `
                <div class="transaction-type ${transaction.type}">${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}</div>
                <div class="transaction-amount ${transaction.type}">${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(2)}</div>
                <div class="transaction-category">${transaction.category}</div>
                <div class="transaction-date">${this.formatDate(transaction.date)}</div>
                <div class="transaction-description">${this.escapeHtml(transaction.description)}</div>
                <div class="transaction-actions">
                    <button class="btn-edit" onclick="tracker.loadTransactionForEdit(${transaction.id})">Edit</button>
                    <button class="btn-delete" onclick="tracker.deleteTransaction(${transaction.id})">Delete</button>
                </div>
            `;
            this.transactionsContainer.appendChild(row);
        });
    }

    /**
     * Update summary cards
     */
    updateSummary() {
        let totalIncome = 0;
        let totalExpenses = 0;

        this.transactions.forEach(t => {
            if (t.type === 'income') {
                totalIncome += t.amount;
            } else {
                totalExpenses += t.amount;
            }
        });

        const balance = totalIncome - totalExpenses;

        this.totalIncomeEl.textContent = `$${totalIncome.toFixed(2)}`;
        this.totalExpensesEl.textContent = `$${totalExpenses.toFixed(2)}`;
        this.balanceEl.textContent = `$${balance.toFixed(2)}`;

        // Color the balance
        if (balance >= 0) {
            this.balanceEl.parentElement.style.color = 'var(--success-color)';
        } else {
            this.balanceEl.parentElement.style.color = 'var(--danger-color)';
        }
    }

    /**
     * Update category filter dropdown
     */
    updateCategoryFilter() {
        const categories = new Set();
        this.transactions.forEach(t => {
            categories.add(t.category);
        });

        // Keep "All Categories" option
        const currentValue = this.categoryFilter.value;
        this.categoryFilter.innerHTML = '<option value="">All Categories</option>';

        // Add sorted categories
        Array.from(categories).sort().forEach(category => {
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category;
            this.categoryFilter.appendChild(option);
        });

        // Restore previous selection
        this.categoryFilter.value = currentValue;
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString + 'T00:00:00');
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Show toast notification
     */
    showToast(message) {
        this.toast.textContent = message;
        this.toast.classList.add('show');

        setTimeout(() => {
            this.toast.classList.remove('show');
        }, 3000);
    }

    /**
     * Save transactions to localStorage
     */
    saveToLocalStorage() {
        localStorage.setItem('transactions', JSON.stringify(this.transactions));
    }

    /**
     * Load transactions from localStorage
     */
    loadFromLocalStorage() {
        const stored = localStorage.getItem('transactions');
        if (stored) {
            try {
                this.transactions = JSON.parse(stored);
            } catch (e) {
                console.error('Error loading from localStorage:', e);
                this.transactions = [];
            }
        }
    }
}

// ===========================
// INITIALIZE APP
// ===========================

let tracker;

document.addEventListener('DOMContentLoaded', () => {
    tracker = new ExpenseTracker();
});
