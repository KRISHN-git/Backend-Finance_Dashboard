# Finance Dashboard Backend

A RESTful backend API for a finance dashboard system built with Node.js, Express, MongoDB, and JWT authentication. Supports role-based access control, financial record management, and dashboard analytics.

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Cloud database |
| Mongoose | ODM for MongoDB |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |
| express-validator | Request body validation |

---

## Project Structure
```
src/
├── config/
│   └── db.js                  # MongoDB connection
├── controllers/
│   ├── authController.js      # Register, login, profile
│   ├── userController.js      # User management
│   ├── recordController.js    # Financial records CRUD
│   └── dashboardController.js # Analytics and summaries
├── middleware/
│   ├── auth.js                # JWT verification
│   └── rbac.js                # Role-based access control
├── models/
│   ├── User.js                # User schema
│   └── FinancialRecord.js     # Financial record schema
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── recordRoutes.js
│   └── dashboardRoutes.js
├── utils/
│   ├── jwt.js                 # Token generation and verification
│   ├── response.js            # Standardized response helpers
│   └── catchAsync.js          # Async error handler wrapper
├── app.js                     # Express app setup
└── server.js                  # Entry point
```

---

## Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/finance-dashboard-backend.git
cd finance-dashboard-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file in the root directory
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

### 4. Start the server
```bash
# Development with auto-restart
npm run dev

# Production
npm start
```

Server runs at `http://localhost:5000`

---

## Roles and Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Register / Login | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| View records | ✅ | ✅ | ✅ |
| Create records | ❌ | ❌ | ✅ |
| Update records | ❌ | ❌ | ✅ |
| Delete records | ❌ | ❌ | ✅ |
| View dashboard summary | ❌ | ✅ | ✅ |
| View category totals | ❌ | ✅ | ✅ |
| View monthly trends | ❌ | ✅ | ✅ |
| View recent activity | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT token |
| GET | `/api/auth/me` | All roles | Get current user profile |

### Users
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Admin | Get all users |
| PUT | `/api/users/:id` | Admin | Update user role or status |
| DELETE | `/api/users/:id` | Admin | Deactivate a user |

### Financial Records
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/records` | All roles | Get all records with filters and pagination |
| GET | `/api/records/:id` | All roles | Get a single record |
| POST | `/api/records` | Admin | Create a new record |
| PUT | `/api/records/:id` | Admin | Update a record |
| DELETE | `/api/records/:id` | Admin | Soft delete a record |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/summary` | Analyst, Admin | Total income, expenses, net balance |
| GET | `/api/dashboard/category-totals` | Analyst, Admin | Totals grouped by category and type |
| GET | `/api/dashboard/monthly-trends` | Analyst, Admin | Month-wise income and expense trends |
| GET | `/api/dashboard/recent` | Analyst, Admin | Last 10 financial records |

---

## Authentication

All protected routes require a Bearer token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

Obtain a token by registering or logging in.

---

## Request and Response Format

### Success Response
```json
{
  "success": true,
  "message": "Records fetched.",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Not authorized.",
  "errors": null
}
```

---

## Filtering and Pagination

Financial records support query-based filtering and pagination:
```
GET /api/records?type=income
GET /api/records?category=Salary
GET /api/records?startDate=2024-01-01&endDate=2024-12-31
GET /api/records?page=2&limit=5
GET /api/records?type=expense&category=Food&page=1&limit=10
```

---

## Features Implemented

### Core Requirements
- User registration, login, and profile management
- Role-based access control with three roles — Viewer, Analyst, Admin
- User status management — active and inactive
- Financial records CRUD with soft delete
- Filtering by type, category, and date range
- Dashboard summary APIs using MongoDB aggregation pipelines
- Category-wise totals and monthly trend analysis
- Recent activity feed

### Optional Enhancements
- JWT authentication with configurable expiry
- Pagination on all record listing endpoints
- Soft delete — records are never permanently removed
- Rate limiting — 100 requests per 15 minutes per IP
- Request body validation using express-validator
- Consistent error handling using catchAsync wrapper
- Standardized API response format across all endpoints

---

## Assumptions and Design Decisions

1. **Role assignment at registration** — Users can self-assign a role during registration for easier testing and evaluation. In a production system, this would be restricted to admins only.

2. **Soft delete** — Financial records are never permanently deleted. The `isDeleted` flag is set to `true` and filtered out from all queries, preserving data integrity and audit history.

3. **Viewer access to records** — Viewers can read financial records but cannot access dashboard analytics. This reflects a scenario where viewers need raw data visibility without aggregated insights.

4. **MongoDB Atlas** — Cloud-hosted MongoDB is used so the API works without any local database setup.

5. **Password security** — Passwords are hashed with bcryptjs using a salt round of 12. Plain passwords are never stored or returned in any response.

6. **Aggregation over application-level calculation** — Dashboard summaries use MongoDB aggregation pipelines rather than fetching all records and calculating in Node.js, keeping the API efficient regardless of data size.

7. **catchAsync utility** — All async controller functions are wrapped with a catchAsync helper that forwards errors to the global error handler, eliminating repetitive try/catch blocks.

---

## Tradeoffs

- No OAuth or social login — JWT alone fully satisfies the assignment scope and keeps the auth flow simple and inspectable.
- No unit tests — given the time constraints, manual testing via Postman was prioritized over automated tests.
- express-validator is applied to the register route — other routes rely on Mongoose schema validation which covers the majority of invalid input cases.