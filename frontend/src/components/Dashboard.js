import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import FilterBar from './FilterBar';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const API_URL = 'http://localhost:5000/api';

function Dashboard({ filters, onFilterChange, categories }) {
  const [summary, setSummary] = useState({ total: 0, by_category: [] });
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.startDate) params.start_date = filters.startDate;
      if (filters.endDate) params.end_date = filters.endDate;

      const [summaryRes, trendsRes] = await Promise.all([
        axios.get(`${API_URL}/analytics/summary`, { params }),
        axios.get(`${API_URL}/analytics/trends`, { params: { period: 'month' } })
      ]);

      setSummary(summaryRes.data);
      setTrends(trendsRes.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const pieChartData = {
    labels: summary.by_category.map(item => item.category),
    datasets: [
      {
        label: 'Expenses by Category',
        data: summary.by_category.map(item => item.total),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
          '#C9CBCF',
          '#FF6B6B',
          '#4ECDC4',
        ],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const barChartData = {
    labels: summary.by_category.map(item => item.category),
    datasets: [
      {
        label: 'Amount ($)',
        data: summary.by_category.map(item => item.total),
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
      },
    ],
  };

  const lineChartData = {
    labels: trends.map(item => item.period),
    datasets: [
      {
        label: 'Monthly Spending Trend',
        data: trends.map(item => item.total),
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.2)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  const totalExpenses = summary.total;
  const expenseCount = summary.by_category.reduce((sum, item) => sum + item.count, 0);
  const averageExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h2>📊 Expense Analytics</h2>
      
      <FilterBar 
        filters={filters}
        onFilterChange={onFilterChange}
        categories={categories}
      />

      <div className="summary-cards">
        <div className="summary-card card-total">
          <h3>Total Spent</h3>
          <p>${totalExpenses.toFixed(2)}</p>
        </div>
        <div className="summary-card card-count">
          <h3>Total Transactions</h3>
          <p>{expenseCount}</p>
        </div>
        <div className="summary-card card-average">
          <h3>Average per Transaction</h3>
          <p>${averageExpense.toFixed(2)}</p>
        </div>
      </div>

      {summary.by_category.length === 0 ? (
        <div className="no-expenses">
          <p>📊 No expense data available for the selected period.</p>
          <p style={{marginTop: '8px', fontSize: '0.875rem'}}>Add some expenses to see your analytics!</p>
        </div>
      ) : (
        <>
          <div className="charts-container">
            <div className="chart-section">
              <h3>🥧 Category Distribution</h3>
              <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                <Pie data={pieChartData} options={chartOptions} />
              </div>
            </div>

            <div className="chart-section">
              <h3>📊 Category Comparison</h3>
              <Bar data={barChartData} options={barOptions} />
            </div>
          </div>

          {trends.length > 0 && (
            <div className="chart-section full-width">
              <h3>📈 Spending Trend Over Time</h3>
              <Line data={lineChartData} options={barOptions} />
            </div>
          )}

          <div style={{ 
            marginTop: '32px', 
            padding: '28px', 
            background: '#f7fafc', 
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ 
              marginBottom: '20px', 
              color: '#2d3748',
              fontSize: '1.125rem',
              fontWeight: '700'
            }}>
              📋 Detailed Category Breakdown
            </h3>
            {summary.by_category.map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '16px 0', 
                borderBottom: index < summary.by_category.length - 1 ? '1px solid #e2e8f0' : 'none'
              }}>
                <span style={{ 
                  fontWeight: '600',
                  color: '#2d3748',
                  fontSize: '0.9375rem'
                }}>
                  {item.category}
                </span>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontWeight: '700',
                    color: '#667eea',
                    fontSize: '1.125rem'
                  }}>
                    ${parseFloat(item.total).toFixed(2)}
                  </div>
                  <div style={{
                    fontSize: '0.8125rem',
                    color: '#718096',
                    marginTop: '2px'
                  }}>
                    {item.count} {item.count === 1 ? 'transaction' : 'transactions'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
