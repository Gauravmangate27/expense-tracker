import React from 'react';
import { format } from 'date-fns';

function ExpenseList({ expenses, onDelete, onEdit }) {
  const total = expenses.reduce((sum, expense) => sum + parseFloat(expense.amount), 0);

  return (
    <div className="expense-list">
      <h2>📋 Expense History</h2>
      
      <div className="total-expenses">
        <h3>Total Expenses</h3>
        <p>${total.toFixed(2)}</p>
        <div style={{marginTop: '8px', fontSize: '0.875rem', opacity: 0.9}}>
          {expenses.length} {expenses.length === 1 ? 'transaction' : 'transactions'}
        </div>
      </div>

      {expenses.length === 0 ? (
        <div className="no-expenses">
          <p>📝 No expenses recorded yet.</p>
          <p style={{marginTop: '8px', fontSize: '0.875rem'}}>Add your first expense to get started!</p>
        </div>
      ) : (
        <div className="expense-items">
          {expenses.map(expense => (
            <div key={expense.id} className="expense-item">
              <div className="expense-header">
                <span className="expense-amount">${parseFloat(expense.amount).toFixed(2)}</span>
                <span className="expense-category">{expense.category}</span>
              </div>
              
              <div className="expense-details">
                <div className="expense-date">
                  {format(new Date(expense.date), 'MMMM dd, yyyy')}
                </div>
                {expense.description && (
                  <div className="expense-description">{expense.description}</div>
                )}
              </div>

              <div className="expense-actions">
                <button className="edit-btn" onClick={() => onEdit(expense)}>
                  ✏️ Edit
                </button>
                <button className="delete-btn" onClick={() => onDelete(expense.id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ExpenseList;
