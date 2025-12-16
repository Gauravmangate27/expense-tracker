import React, { useState, useEffect } from 'react';
import './App.css';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Dashboard from './components/Dashboard';
import FilterBar from './components/FilterBar';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: 'All'
  });
  const [activeTab, setActiveTab] = useState('expenses');
  const [editingExpense, setEditingExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
    fetchExpenses();
  }, [filters]);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;
      if (filters.category !== 'All') params.category = filters.category;

      const response = await axios.get(`${API_URL}/expenses`, { params });
      setExpenses(response.data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
      alert('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddExpense = async (expenseData) => {
    try {
      await axios.post(`${API_URL}/expenses`, expenseData);
      fetchExpenses();
      return true;
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense');
      return false;
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      await axios.put(`${API_URL}/expenses/${id}`, expenseData);
      fetchExpenses();
      setEditingExpense(null);
      return true;
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense');
      return false;
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`${API_URL}/expenses/${id}`);
        fetchExpenses();
      } catch (error) {
        console.error('Error deleting expense:', error);
        alert('Failed to delete expense');
      }
    }
  };

  const handleAddCategory = async (categoryName, color) => {
    try {
      await axios.post(`${API_URL}/categories`, { name: categoryName, color });
      fetchCategories();
      return true;
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Category already exists or invalid data');
      return false;
    }
  };

  return (
    <div className="App">
      <header className="app-header">
        <div className="app-header-content">
          <h1>💰 Personal Expense Tracker</h1>
          <p>Track your spending, understand your habits, achieve your financial goals</p>
        </div>
      </header>

      <div className="tab-navigation">
        <div className="tab-navigation-inner">
          <button 
            className={activeTab === 'expenses' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('expenses')}
          >
            📝 Expenses
          </button>
          <button 
            className={activeTab === 'dashboard' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('dashboard')}
          >
            📊 Dashboard
          </button>
        </div>
      </div>

      <div className="app-container">
        {activeTab === 'expenses' ? (
          <>
            <div className="form-section">
              <ExpenseForm 
                onSubmit={editingExpense ? 
                  (data) => handleUpdateExpense(editingExpense.id, data) : 
                  handleAddExpense
                }
                categories={categories}
                onAddCategory={handleAddCategory}
                editingExpense={editingExpense}
                onCancelEdit={() => setEditingExpense(null)}
              />
            </div>

            <div className="list-section">
              <FilterBar 
                filters={filters}
                onFilterChange={setFilters}
                categories={categories}
              />
              
              {loading ? (
                <div className="loading">Loading expenses...</div>
              ) : (
                <ExpenseList 
                  expenses={expenses}
                  onDelete={handleDeleteExpense}
                  onEdit={setEditingExpense}
                />
              )}
            </div>
          </>
        ) : (
          <div className="dashboard-container">
            <Dashboard filters={filters} onFilterChange={setFilters} categories={categories} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
