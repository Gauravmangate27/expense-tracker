import React from 'react';

function FilterBar({ filters, onFilterChange, categories }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReset = () => {
    onFilterChange({
      startDate: '',
      endDate: '',
      category: 'All'
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="startDate">Start Date</label>
        <input
          type="date"
          id="startDate"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="endDate">End Date</label>
        <input
          type="date"
          id="endDate"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={filters.category}
          onChange={handleChange}
        >
          <option value="All">All Categories</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>&nbsp;</label>
        <button 
          onClick={handleReset}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: '#fc8181',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '0.9375rem',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.background = '#f56565'}
          onMouseLeave={(e) => e.target.style.background = '#fc8181'}
        >
          🔄 Reset Filters
        </button>
      </div>
    </div>
  );
}

export default FilterBar;
