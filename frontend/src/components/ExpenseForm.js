import React, { useState, useEffect } from 'react';

function ExpenseForm({ onSubmit, categories, onAddCategory, editingExpense, onCancelEdit }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        amount: editingExpense.amount,
        category: editingExpense.category,
        description: editingExpense.description || '',
        date: editingExpense.date
      });
    }
  }, [editingExpense]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }

    const success = await onSubmit(formData);
    
    if (success) {
      // Reset form after successful submission
      if (!editingExpense) {
        setFormData({
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
    }
  };

  const handleAddNewCategory = () => {
    const categoryName = prompt('Enter new category name:');
    if (categoryName && categoryName.trim()) {
      const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      onAddCategory(categoryName.trim(), randomColor);
    }
  };

  return (
    <div className="expense-form">
      <h2>{editingExpense ? '✏️ Edit Expense' : '➕ Add New Expense'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">💵 Amount ($) *</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            placeholder="0.00"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="category">🏷️ Category *</label>
          <div className="category-input-group">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <button 
              type="button" 
              className="add-category-btn"
              onClick={handleAddNewCategory}
            >
              + New
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="date">📅 Date *</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">📝 Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Optional notes about this expense..."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editingExpense ? 'Update Expense' : 'Add Expense'}
          </button>
          {editingExpense && (
            <button type="button" className="cancel-btn" onClick={onCancelEdit}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
