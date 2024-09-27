# Café Management System

## Overview

The Café Management System is a full-stack application that allows users to manage café details and employees, including the ability to upload and display café logos. The backend uses a Flask API with a MySQL database for persistence, while the frontend is built with React and presents a user-friendly interface for performing CRUD operations on both cafés and employees.

The frontend uses Tanstack Router for navigation, Tanstack Query for efficient data-fetching, AgGrid for displaying paginated tables, and Material-UI for a modern, responsive interface.

This project has been deployed on DigitalOcean for production readiness.

---

## Features

### Frontend
- **Café Management**
  - Add, Edit, Delete cafés
  - Upload and preview café logos
  - Filter cafés by location
  - View a list of employees under each café
  - Pagination for café listings
  - Responsive and user-friendly UI
  
- **Employee Management**
  - Add, Edit, Delete employees
  - Assign employees to specific cafés
  - View employees by café
  - Filter employees by café
  - Pagination for employee listings

### Backend
- REST API Endpoints for managing cafés and employees
- MySQL database integration for persisting café and employee data
- Binary image storage for café logos (converted to base64 for frontend display)
- CRUD operations for both cafés and employees
- Data filtering and sorting for cafés and employees based on location and café name

---

## Technology Stack

### Frontend:
- **React** (JavaScript framework)
- **Tanstack Router** (Views management)
- **Tanstack Query** (State management and data-fetching)
- **AG Grid** (Data table for listing cafés and employees)
- **Material-UI** (CSS framework for styling and UI components)

### Backend:
- **Flask** (Python framework for API)
- **SQLAlchemy** (ORM for database)
- **MySQL** (Database for data persistence)
- **Flask-CORS** (Enable Cross-Origin Resource Sharing)

---

## Folder Structure

```
cafe-management-system/
│
├── frontend/                     # React frontend project
│   ├── src/                      # Source files
│   │   ├── components/           # Reusable React components
│   │   ├── pages/                # Pages for Cafes and Employees
│   │   ├── services/             # API services (Axios integration)
│   │   ├── App.js                # Main App component
│   │   └── index.js              # Main entry point for React
│   └── public/                   # Public files (index.html, etc.)
│
├── backend/                      # Flask backend project
│   ├── app/                      # Source files for Flask API
│   │   ├── routes/               # API route handlers
│   │   ├── models/               # Database models (Cafe, Employee)
│   │   ├── utils/                # Utility files (e.g., database connection)
│   │   └── main.py               # Main entry point for Flask API
│   └── migrations/               # Database migrations
│
└── README.md                     # Project documentation
```

---

## Setup Instructions

### Prerequisites

- **Node.js** (for running the frontend)
- **Python 3.9+** (for the backend)
- **MySQL** (for the database)

---

## Backend Setup

1. **Navigate to the backend directory**:
    ```bash
    cd backend
    ```

2. **Create a virtual environment**:
    ```bash
    python3 -m venv venv
    source venv/bin/activate
    ```

3. **Install the backend dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

4. **Configure the MySQL database**:
   - Make sure MySQL is running.
   - Update the `app/utils/db.py` file with your MySQL credentials.

5. **Run database migrations**:
    ```bash
    flask db upgrade
    ```

6. **Seed the database** (optional):
    ```bash
    python seeds.py
    ```

7. **Run the backend server**:
    ```bash
    python main.py
    ```

---

## Frontend Setup

1. **Navigate to the frontend directory**:
    ```bash
    cd frontend
    ```

2. **Install the frontend dependencies**:
    ```bash
    npm install
    ```

3. **Start the React development server**:
    ```bash
    npm run dev
    ```

This will run the frontend on `http://localhost:3000` (or another available port).

---

## API Endpoints

### Café Endpoints
- **GET** `/cafes?location=<location>` – Fetch cafes with optional filtering by location.
- **POST** `/cafe` – Add a new café.
- **PUT** `/cafe` – Update an existing café.
- **DELETE** `/cafe/<id>` – Delete a café (also deletes associated employees).

### Employee Endpoints
- **GET** `/employees?cafe=<café>` – Fetch employees with optional filtering by café.
- **POST** `/employee` – Add a new employee.
- **PUT** `/employee` – Update an existing employee.
- **DELETE** `/employee/<id>` – Delete an employee.

---

## Conclusion

This Café Management System is ready for use with its deployed version running on DigitalOcean. The codebase is optimized for production and includes clean folder structures, reusability of components, and good practices for state management using Tanstack Query.

---
