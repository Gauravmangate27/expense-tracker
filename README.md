<<<<<<< HEAD
# Personal Expense Tracker

A full-stack expense tracking application built with Python Flask backend, React frontend, and SQLite database. Track your daily expenses, categorize them, and visualize your spending patterns with interactive charts.

## Features

- 💰 **Expense Management**: Add, edit, and delete expenses
- 📊 **Analytics Dashboard**: View spending summaries and trends
- 🏷️ **Custom Categories**: Create and manage expense categories
- 📈 **Interactive Charts**: Pie charts, bar charts, and line graphs
- 🔍 **Filtering**: Filter expenses by date range and category
- 💾 **Data Persistence**: SQLite database for reliable data storage
- 🎨 **Modern UI**: Beautiful, responsive React interface

## Tech Stack

### Backend
- Python 3.x
- Flask (Web framework)
- Flask-CORS (Cross-origin resource sharing)
- SQLite (Database)

### Frontend
- React 18
- Axios (HTTP client)
- Chart.js & react-chartjs-2 (Data visualization)
- date-fns (Date formatting)

## Project Structure

```
personal/
├── backend/
│   ├── app.py              # Flask application and API endpoints
│   ├── requirements.txt    # Python dependencies
│   ├── .env.example       # Environment variables template
│   └── expenses.db        # SQLite database (auto-created)
│
└── frontend/
    ├── public/
    │   └── index.html     # HTML template
    ├── src/
    │   ├── components/
    │   │   ├── ExpenseForm.js    # Form for adding/editing expenses
    │   │   ├── ExpenseList.js    # List of all expenses
    │   │   ├── FilterBar.js      # Filtering controls
    │   │   └── Dashboard.js      # Analytics and charts
    │   ├── App.js         # Main application component
    │   ├── App.css        # Application styles
    │   └── index.js       # React entry point
    └── package.json       # Node.js dependencies
```

## Installation & Setup

### Prerequisites
- Python 3.8 or higher
- Node.js 14 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
venv\Scripts\activate
```

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file (optional):
```bash
copy .env.example .env
```

5. Start the Flask server:
```bash
python app.py
```

The backend server will run on `http://localhost:5000`

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## Usage

### Adding Expenses
1. Fill in the expense form on the left side
2. Enter amount, select category, choose date, and add optional description
3. Click "Add Expense" to save

### Viewing Expenses
- All expenses are displayed on the right side in chronological order
- Click "Edit" to modify an expense
- Click "Delete" to remove an expense (with confirmation)

### Using Filters
- Filter by date range using start and end date pickers
- Filter by category using the dropdown
- Click "Reset Filters" to clear all filters

### Analytics Dashboard
1. Click the "Dashboard" tab at the top
2. View summary cards showing:
   - Total amount spent
   - Number of transactions
   - Average per transaction
3. Analyze spending with:
   - Pie chart showing category distribution
   - Bar chart comparing category totals
   - Line chart showing spending trends over time
4. Review detailed category breakdown at the bottom

### Managing Categories
- Click "+ New" button next to the category dropdown
- Enter a category name to add a new category
- Default categories include: Food, Transport, Entertainment, Shopping, Bills, Health, Other

## API Endpoints

### Expenses
- `GET /api/expenses` - Get all expenses (supports filtering)
- `POST /api/expenses` - Add a new expense
- `PUT /api/expenses/<id>` - Update an expense
- `DELETE /api/expenses/<id>` - Delete an expense

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add a new category

### Analytics
- `GET /api/analytics/summary` - Get spending summary by category
- `GET /api/analytics/trends` - Get spending trends over time
- `GET /api/health` - Health check endpoint

## Database Schema

### expenses table
- `id` - Primary key
- `amount` - Expense amount (REAL)
- `category` - Category name (TEXT)
- `description` - Optional description (TEXT)
- `date` - Expense date (DATE)
- `created_at` - Timestamp (TIMESTAMP)

### categories table
- `id` - Primary key
- `name` - Category name (TEXT, UNIQUE)
- `color` - Color code for charts (TEXT)

## Development Tips

### Backend Development
- Database is automatically initialized on first run
- Default categories are seeded automatically
- CORS is enabled for frontend communication
- Debug mode is enabled by default

### Frontend Development
- Hot reload is enabled - changes reflect immediately
- Proxy configured to forward API requests to Flask backend
- Chart.js provides rich visualization options
- Date formatting uses date-fns for consistency

## Troubleshooting

### Backend Issues
- **Port already in use**: Change port in `app.py` or kill the process using port 5000
- **Module not found**: Ensure virtual environment is activated and dependencies are installed
- **Database locked**: Close any other connections to `expenses.db`

### Frontend Issues
- **Cannot connect to backend**: Ensure Flask server is running on port 5000
- **Dependencies error**: Delete `node_modules` folder and run `npm install` again
- **Charts not displaying**: Check browser console for errors, ensure Chart.js is installed

## Future Enhancements

- User authentication and multi-user support
- Budget setting and alerts
- Recurring expense support
- Export data to CSV/PDF
- Mobile app version
- Receipt image uploads
- Advanced reporting features

## License

This project is open source and available for educational purposes.

## Contributing

Feel free to submit issues and enhancement requests!
=======
# expense-tracker
>>>>>>> 7c8f587c4571b0fc0f5d81d92b89e20a0e58fd63
