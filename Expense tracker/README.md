# 💰 Expense Tracker

A simple, responsive web application for tracking income and expenses. Built with vanilla HTML, CSS, and JavaScript—no frameworks or build tools required.

## Features

### Core Functionality
- ✅ **Add Transactions** - Form to record income or expenses with type, amount, category, date, and description
- ✅ **Transaction List** - View all transactions sorted by newest first, color-coded by type (green for income, red for expense)
- ✅ **Edit Transactions** - Click "Edit" to modify any transaction; form auto-populates with existing values
- ✅ **Delete Transactions** - Remove transactions with confirmation prompt
- ✅ **Live Summary** - Real-time totals for income, expenses, and balance that update instantly
- ✅ **Filtering** - Filter by transaction type (Income/Expense) and category, with combined filtering support
- ✅ **Local Storage** - All transactions persist in browser's local storage and reload on page refresh
- ✅ **Form Validation** - Inline error messages for invalid inputs (negative amounts, missing fields, etc.)
- ✅ **Empty State** - Friendly message when no transactions exist

### Categories
Predefined categories:
- Salary
- Food
- Transport
- Shopping
- Bills
- Entertainment
- Other

### Design
- **Responsive Layout** - Optimized for desktop, tablet, and mobile devices
- **Modern UI** - Gradient header, card-based design with smooth animations
- **Accessibility** - Clear labels, focus states, and keyboard navigation support
- **Toast Notifications** - Success messages after actions (add, edit, delete)

## Project Structure

```
Expense Tracker/
├── index.html          # HTML structure and form elements
├── style.css           # All styling and responsive design
├── script.js           # JavaScript logic and transaction management
└── README.md           # This file
```

## How to Run

### Option 1: Open in Browser Directly
1. Navigate to the `Expense Tracker` folder
2. Double-click `index.html` to open in your default browser
3. Start tracking your expenses!

### Option 2: Use Live Server (Recommended for Development)
1. Install the **Live Server** extension in VS Code
2. Right-click on `index.html` and select "Open with Live Server"
3. The app will open in your browser with auto-reload on file changes

### Option 3: Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Then visit `http://localhost:8000` in your browser.

## Usage

### Adding a Transaction
1. Select transaction type (Income or Expense)
2. Enter amount (positive number)
3. Choose category from dropdown
4. Select date (defaults to today)
5. Add a brief description
6. Click "Add Transaction"

### Editing a Transaction
1. Click "Edit" on any transaction row
2. Form auto-populates with existing values
3. Make changes and click "Update Transaction"
4. Original transaction is updated (no duplicate created)

### Deleting a Transaction
1. Click "Delete" on any transaction row
2. Confirm deletion in the popup dialog
3. Transaction is removed and summary updates

### Filtering Transactions
1. Use "Type" dropdown to filter by Income/Expense
2. Use "Category" dropdown to filter by category
3. Both filters combine (e.g., show only Food Expenses)
4. Click "Clear Filters" to reset both

## Local Storage

All transactions are automatically saved to your browser's `localStorage` under the key `transactions`. This means:
- ✅ Your data persists even after closing the browser
- ✅ Data is stored locally (no server required)
- ✅ Each transaction gets a unique ID using timestamps
- ✅ Storage is cleared only if you clear browser data

To manually clear data: Open browser DevTools → Application → Local Storage → Delete `transactions` key.

## Form Validation

The app validates all fields with inline error messages:

| Field | Validation Rules |
|-------|-----------------|
| Type | Must select Income or Expense |
| Amount | Must be a positive number (>0) |
| Category | Must select from dropdown |
| Date | Must provide a date |
| Description | Must not be empty (max 100 chars) |

## Responsive Design

- **Desktop (1000px+)**: Full multi-column layout
- **Tablet (768px-999px)**: 1-column form, adapted transaction display
- **Mobile (<768px)**: Single-column layout, compact spacing
- **Very Small (<480px)**: Optimized for phone screens

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

**Note**: Local Storage must be enabled for data persistence.

## Code Quality

### Architecture
- **Object-Oriented**: Single `ExpenseTracker` class manages all state and logic
- **Modular Functions**: Clear separation of concerns (validation, rendering, storage, filtering)
- **Comments**: Key functions documented with purpose and parameters
- **Clean CSS**: Organized with sections, CSS variables for colors, BEM-style naming

### Key Functions
- `addTransaction(formData)` - Add new transaction and update UI
- `editTransaction(id, formData)` - Update existing transaction
- `deleteTransaction(id)` - Remove transaction with confirmation
- `renderTransactions()` - Render filtered transactions to DOM
- `updateSummary()` - Calculate and display totals
- `saveToLocalStorage()` - Persist transactions to browser storage
- `loadFromLocalStorage()` - Load transactions from storage on page load
- `validateForm()` - Validate all form inputs with error handling

### Security
- HTML escaping to prevent XSS attacks
- No eval() or dangerous operations
- Input validation on all fields

## Known Limitations

1. **No Backend** - Data stored only locally; not synced across devices
2. **No User Accounts** - No login or user management
3. **No Export/Import** - Cannot easily export data to CSV/Excel
4. **Single Browser** - Data specific to browser and device
5. **No Recurring Transactions** - Each transaction must be added manually
6. **Basic Charts** - No built-in graphing (can be added with Chart.js if needed)
7. **No Budget Alerts** - No notifications for budget limits
8. **No Search** - Only filtering available, not full-text search

## Possible Enhancements

- Add monthly summary view (total income/expenses by month)
- Implement data export as CSV
- Add category-wise expense chart (with Chart.js CDN)
- Search functionality by description or category
- Budget limits with alerts
- Recurring transaction templates
- Dark mode toggle
- Multi-currency support
- Data backup to cloud storage

## License

This project is open source and free to use for personal or commercial purposes.

---

**Created**: 2026  
**Last Updated**: 2026-09-01
