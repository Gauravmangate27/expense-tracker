from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime, timedelta
import sqlite3
import os
from functools import wraps

# Initialize Flask application
app = Flask(__name__)
CORS(app)

# Configuration
DATABASE = 'expenses.db'

# ============================================
# Database Helper Functions
# ============================================

def get_db_connection():
    """Create and return a database connection with row factory."""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    """Initialize database with required tables and default categories."""
    conn = get_db_connection()
    
    # Create expenses table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS expenses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            amount REAL NOT NULL,
            category TEXT NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Create categories table
    conn.execute('''
        CREATE TABLE IF NOT EXISTS categories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE NOT NULL,
            color TEXT
        )
    ''')
    
    # Insert default categories with colors
    default_categories = [
        ('Food', '#FF6384'),
        ('Transport', '#36A2EB'),
        ('Entertainment', '#FFCE56'),
        ('Shopping', '#4BC0C0'),
        ('Bills', '#9966FF'),
        ('Health', '#FF9F40'),
        ('Other', '#C9CBCF')
    ]
    
    for cat, color in default_categories:
        try:
            conn.execute('INSERT INTO categories (name, color) VALUES (?, ?)', (cat, color))
        except sqlite3.IntegrityError:
            pass  # Category already exists
    
    conn.commit()
    conn.close()
    print("✅ Database initialized successfully!")

# Initialize database on startup
init_db()

# ============================================
# Expense Endpoints
# ============================================
@app.route('/api/expenses', methods=['GET'])
def get_expenses():
    """Get all expenses with optional filtering by date range and category."""
    conn = get_db_connection()
    
    # Get query parameters for filtering
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    category = request.args.get('category')
    
    # Build dynamic query
    query = 'SELECT * FROM expenses WHERE 1=1'
    params = []
    
    if start_date:
        query += ' AND date >= ?'
        params.append(start_date)
    
    if end_date:
        query += ' AND date <= ?'
        params.append(end_date)
    
    if category and category != 'All':
        query += ' AND category = ?'
        params.append(category)
    
    query += ' ORDER BY date DESC'
    
    expenses = conn.execute(query, params).fetchall()
    conn.close()
    
    return jsonify([dict(expense) for expense in expenses]), 200

@app.route('/api/expenses', methods=['POST'])
def add_expense():
    """Add a new expense record."""
    data = request.json
    
    # Validate required fields
    if not data.get('amount') or not data.get('category') or not data.get('date'):
        return jsonify({'error': 'Missing required fields: amount, category, and date are required'}), 400
    
    # Validate amount is positive
    try:
        amount = float(data['amount'])
        if amount <= 0:
            return jsonify({'error': 'Amount must be greater than 0'}), 400
    except (ValueError, TypeError):
        return jsonify({'error': 'Invalid amount value'}), 400
    
    conn = get_db_connection()
    cursor = conn.execute(
        'INSERT INTO expenses (amount, category, description, date) VALUES (?, ?, ?, ?)',
        (amount, data['category'], data.get('description', ''), data['date'])
    )
    conn.commit()
    expense_id = cursor.lastrowid
    conn.close()
    
    return jsonify({
        'id': expense_id, 
        'message': 'Expense added successfully',
        'expense': {
            'id': expense_id,
            'amount': amount,
            'category': data['category'],
            'description': data.get('description', ''),
            'date': data['date']
        }
    }), 201

@app.route('/api/expenses/<int:expense_id>', methods=['PUT'])
def update_expense(expense_id):
    """Update an existing expense record."""
    data = request.json
    
    # Validate amount if provided
    if 'amount' in data:
        try:
            amount = float(data['amount'])
            if amount <= 0:
                return jsonify({'error': 'Amount must be greater than 0'}), 400
        except (ValueError, TypeError):
            return jsonify({'error': 'Invalid amount value'}), 400
    
    conn = get_db_connection()
    
    # Check if expense exists
    expense = conn.execute('SELECT * FROM expenses WHERE id = ?', (expense_id,)).fetchone()
    if not expense:
        conn.close()
        return jsonify({'error': 'Expense not found'}), 404
    
    conn.execute(
        'UPDATE expenses SET amount = ?, category = ?, description = ?, date = ? WHERE id = ?',
        (data['amount'], data['category'], data.get('description', ''), data['date'], expense_id)
    )
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Expense updated successfully'}), 200

@app.route('/api/expenses/<int:expense_id>', methods=['DELETE'])
def delete_expense(expense_id):
    """Delete an expense record."""
    conn = get_db_connection()
    
    # Check if expense exists
    expense = conn.execute('SELECT * FROM expenses WHERE id = ?', (expense_id,)).fetchone()
    if not expense:
        conn.close()
        return jsonify({'error': 'Expense not found'}), 404
    
    conn.execute('DELETE FROM expenses WHERE id = ?', (expense_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Expense deleted successfully'}), 200

# ============================================
# Category Endpoints
# ============================================
@app.route('/api/categories', methods=['GET'])
def get_categories():
    """Get all expense categories."""
    conn = get_db_connection()
    categories = conn.execute('SELECT * FROM categories ORDER BY name').fetchall()
    conn.close()
    
    return jsonify([dict(category) for category in categories]), 200
@app.route('/api/categories', methods=['POST'])
def add_category():
    """Add a new expense category."""
    data = request.json
    
    if not data.get('name'):
        return jsonify({'error': 'Category name is required'}), 400
    
    # Validate category name
    category_name = data['name'].strip()
    if len(category_name) < 2:
        return jsonify({'error': 'Category name must be at least 2 characters'}), 400
    
    conn = get_db_connection()
    try:
        cursor = conn.execute(
            'INSERT INTO categories (name, color) VALUES (?, ?)',
            (category_name, data.get('color', '#808080'))
        )
        conn.commit()
        category_id = cursor.lastrowid
        conn.close()
        return jsonify({
            'id': category_id, 
            'message': 'Category added successfully',
            'category': {
                'id': category_id,
                'name': category_name,
                'color': data.get('color', '#808080')
            }
        }), 201
    except sqlite3.IntegrityError:
        conn.close()
        return jsonify({'error': 'Category already exists'}), 400

# ============================================
# Analytics Endpoints
# ============================================
@app.route('/api/analytics/summary', methods=['GET'])
def get_summary():
    """Get spending summary by category with optional date filtering."""
    conn = get_db_connection()
    
    start_date = request.args.get('start_date')
    end_date = request.args.get('end_date')
    
    # Build query for category summary
    query = 'SELECT SUM(amount) as total, category, COUNT(*) as count FROM expenses WHERE 1=1'
    params = []
    
    if start_date:
        query += ' AND date >= ?'
        params.append(start_date)
    
    if end_date:
        query += ' AND date <= ?'
        params.append(end_date)
    
    query += ' GROUP BY category ORDER BY total DESC'
    
    summary = conn.execute(query, params).fetchall()
    
    # Get total spending
    total_query = 'SELECT SUM(amount) as total FROM expenses WHERE 1=1'
    if start_date:
        total_query += ' AND date >= ?'
    if end_date:
        total_query += ' AND date <= ?'
    
    total = conn.execute(total_query, params).fetchone()
    
    conn.close()
    
    return jsonify({
        'total': total['total'] if total['total'] else 0,
        'by_category': [dict(row) for row in summary]
    }), 200

@app.route('/api/analytics/trends', methods=['GET'])
def get_trends():
    """Get spending trends over time grouped by period (day, week, or month)."""
    conn = get_db_connection()
    
    period = request.args.get('period', 'month')  # day, week, month
    
    # Determine date format and lookback period
    if period == 'day':
        date_format = '%Y-%m-%d'
        days = 30
    elif period == 'week':
        date_format = '%Y-%W'
        days = 90
    else:  # month
        date_format = '%Y-%m'
        days = 365
    
    start_date = (datetime.now() - timedelta(days=days)).strftime('%Y-%m-%d')
    
    query = f'''
        SELECT strftime('{date_format}', date) as period, 
               SUM(amount) as total,
               COUNT(*) as count
        FROM expenses 
        WHERE date >= ?
        GROUP BY period
        ORDER BY period
    '''
    
    trends = conn.execute(query, (start_date,)).fetchall()
    conn.close()
    
    return jsonify([dict(row) for row in trends]), 200

# ============================================
# Health Check Endpoint
# ============================================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint to verify API is running."""
    return jsonify({
        'status': 'healthy', 
        'message': 'Expense Tracker API is running',
        'version': '1.0.0',
        'timestamp': datetime.now().isoformat()
    }), 200

# ============================================
# Application Entry Point
# ============================================

if __name__ == '__main__':
    print("=" * 50)
    print("🚀 Starting Expense Tracker API Server")
    print("=" * 50)
    print("📍 Server running on: http://localhost:5000")
    print("📊 Health check: http://localhost:5000/api/health")
    print("=" * 50)
    app.run(debug=True, port=5000, host='0.0.0.0')