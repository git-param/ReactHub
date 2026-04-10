# ReactHub Backend API

FastAPI + PostgreSQL backend for ReactHub component library marketplace.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL 12+
- pip or pip3

### 1. Setup Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On macOS/Linux
# or
venv\Scripts\activate     # On Windows
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Setup PostgreSQL Database

```bash
# Create database
psql -U postgres
CREATE DATABASE reacthub_db;
CREATE USER reacthub_user WITH PASSWORD 'secure_password';
ALTER ROLE reacthub_user SET client_encoding TO 'utf8';
ALTER ROLE reacthub_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE reacthub_user SET default_transaction_deferrable TO on;
ALTER ROLE reacthub_user SET default_transaction_level TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE reacthub_db TO reacthub_user;
```

### 4. Configure Environment Variables

The `.env` file is already created with default values. Update the `SECRET_KEY` if needed:

```bash
# .env
DATABASE_URL=postgresql://reacthub_user:secure_password@localhost:5432/reacthub_db
SECRET_KEY=your-super-secret-key-change-this-in-production-min-32-chars
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:8000
DEBUG=True
ENVIRONMENT=development
```

### 5. Run the Server

```bash
python -m app.main
# or
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Server will run on: `http://localhost:8000`

### 6. View API Documentation

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

---

## 📁 Project Structure

```
backend/
├── app/
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── component.py
│   │   ├── comment.py
│   │   ├── vote.py
│   │   └── feedback.py
│   ├── schemas/             # Pydantic request/response schemas
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── component.py
│   │   ├── comment.py
│   │   └── feedback.py
│   ├── routes/              # API endpoint handlers
│   │   ├── __init__.py
│   │   └── auth.py
│   ├── services/            # Business logic (to be added)
│   ├── utils/               # Utility functions
│   │   ├── __init__.py
│   │   ├── constants.py     # Application constants
│   │   ├── security.py      # JWT, password hashing
│   │   ├── exceptions.py    # Custom exceptions
│   │   └── validators.py    # Data validation (optional)
│   ├── __init__.py
│   ├── main.py              # FastAPI app entry point
│   ├── config.py            # Configuration & settings
│   ├── database.py          # Database connection setup
│   └── dependencies.py      # FastAPI dependencies
├── tests/                   # Test files
├── .env                     # Environment variables
├── .gitignore
├── requirements.txt         # Python dependencies
└── README.md                # This file
```

---

## 🔐 Authentication

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Login User
```bash
POST /api/auth/login?email=john@example.com&password=SecurePass123
```

Response:
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2026-04-08T10:00:00"
  }
}
```

### Using the Token
Include the token in the Authorization header:
```
Authorization: Bearer <your_access_token>
```

---

## 🗄️ Database Schema

### Users Table
- id (primary key)
- name
- email (unique)
- password_hash
- role (admin/user)
- avatar
- is_active
- is_verified
- created_at, updated_at

### Components Table
- id (primary key, string)
- slug (unique)
- name
- description
- category
- framework (JSON)
- component_code
- css_code
- usage_code
- install_cmd (JSON)
- preview_image
- status (draft/published/archived)
- user_id (foreign key)
- created_at, updated_at

### Comments Table
- id (primary key)
- component_id (foreign key)
- user_id (foreign key)
- text
- created_at, updated_at

### Votes Table
- id (primary key)
- component_id (foreign key)
- user_id (foreign key)
- unique(component_id, user_id)
- created_at

### Feedback Table
- id (primary key)
- user_id (foreign key, nullable)
- subject
- message
- category
- status (new/in_progress/resolved/closed)
- created_at, updated_at

---

## 🔌 API Endpoints (Implemented)

### Authentication
- ✅ `POST /api/auth/register` - Register new user
- ✅ `POST /api/auth/login` - Login user
- ⏳ `GET /api/auth/me` - Get current user (partial)

### Health Check
- ✅ `GET /health` - Health check
- ✅ `GET /` - Root endpoint

---

## 📦 Dependencies

All dependencies are listed in `requirements.txt`:

- **FastAPI** - Web framework
- **Uvicorn** - ASGI server
- **SQLAlchemy** - ORM
- **psycopg2** - PostgreSQL driver
- **Pydantic** - Data validation
- **python-jose** - JWT handling
- **passlib** - Password hashing
- **python-dotenv** - Environment variables
- **pytest** - Testing framework

---

## 🧪 Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/test_auth.py -v
```

---

## 📝 Environment Variables

See `.env` file for available configuration options:

```
DATABASE_URL              # PostgreSQL connection string
SQLALCHEMY_ECHO          # Log SQL queries (True/False)
SECRET_KEY               # JWT signing key (keep secret!)
ALGORITHM                # JWT algorithm (HS256)
ACCESS_TOKEN_EXPIRE_MINUTES   # Token expiration in minutes
FRONTEND_URL             # Frontend origin for CORS
BACKEND_URL              # Backend URL
DEBUG                    # Debug mode (True/False)
ENVIRONMENT              # development/staging/production
```

---

## 🚨 Common Issues

### PostgreSQL Connection Error
```
Error: could not connect to database
```
Solution:
1. Check PostgreSQL is running
2. Verify DATABASE_URL in .env
3. Check database exists and user has permissions

### Module Not Found
```
ModuleNotFoundError: No module named 'app'
```
Solution:
1. Ensure virtual environment is activated
2. Run from backend directory
3. Install dependencies: `pip install -r requirements.txt`

### Port Already in Use
```
ERROR: address already in use
```
Solution:
```bash
# Use different port
uvicorn app.main:app --port 8001

# Or kill process using port 8000
lsof -ti:8000 | xargs kill -9
```

---

## 🔄 Development Workflow

1. Create models in `app/models/`
2. Create schemas in `app/schemas/`
3. Create routes in `app/routes/`
4. Add business logic in `app/services/`
5. Test with Swagger UI at `http://localhost:8000/docs`
6. Write tests in `tests/`

---

## 📚 Next Steps

- Implement Component management endpoints
- Implement Comment system
- Implement Voting system
- Implement Feedback system
- Implement Admin features
- Add email verification
- Add password reset functionality
- Set up database migrations with Alembic
- Add comprehensive tests
- Add caching layer
- Deploy to production

---

## 🤝 Contributing

- Follow PEP 8 style guide
- Write tests for new features
- Update documentation
- Use meaningful commit messages

---

## 📞 Support

For issues or questions:
1. Check this README
2. Check API docs at `/docs`
3. Check git history for similar issues
4. Create an issue in repository

---

**Created**: April 8, 2026
**Status**: In Development
**Version**: 1.0.0
