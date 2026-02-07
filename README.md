# Author Royalties API

A RESTful API for managing author royalties, book sales, and withdrawals built with Node.js, Express, and SQLite.

## Quick Start

### Installation

```bash
npm install
```

### Run Server

```bash
npm start
```

Server runs on: **http://localhost:3000**

## Database

Uses **SQLite** (file-based, zero configuration). The database file `data.sqlite` is automatically created with seed data on first run.

### Seed Data

**Authors:**

- ID 1: Priya Sharma (priya@email.com) - Balance: ₹3,825
- ID 2: Rahul Verma (rahul@email.com) - Balance: ₹9,975
- ID 3: Anita Desai (anita@email.com) - Balance: ₹400

**Books:**

- Book 1: "The Silent River" by Priya Sharma - ₹45/sale
- Book 2: "Midnight in Mumbai" by Priya Sharma - ₹60/sale
- Book 3: "Code & Coffee" by Rahul Verma - ₹75/sale
- Book 4: "Startup Diaries" by Rahul Verma - ₹50/sale
- Book 5: "Poetry of Pain" by Rahul Verma - ₹30/sale
- Book 6: "Garden of Words" by Anita Desai - ₹40/sale

**Sales:**

- Book 1: 25 copies (2025-01-05), 40 copies (2025-01-12)
- Book 2: 15 copies (2025-01-08)
- Book 3: 60 copies (2025-01-03), 45 copies (2025-01-15)
- Book 4: 30 copies (2025-01-10)
- Book 5: 20 copies (2025-01-18)
- Book 6: 10 copies (2025-01-20)

## API Endpoints

### 1. GET /authors

Returns list of all authors with earnings and balance.

**Response: 200 OK**

```json
[
  {
    "id": 1,
    "name": "Priya Sharma",
    "total_earnings": 3825,
    "current_balance": 3825
  }
]
```

### 2. GET /authors/:id

Returns detailed author information with books.

**Response: 200 OK**

```json
{
  "id": 1,
  "name": "Priya Sharma",
  "email": "priya@email.com",
  "current_balance": 3825,
  "total_earnings": 3825,
  "total_books": 2,
  "books": [
    {
      "id": 1,
      "title": "The Silent River",
      "royalty_per_sale": 45,
      "total_sold": 65,
      "total_royalty": 2925
    }
  ]
}
```

**Error: 404 Not Found** (if author doesn't exist)

### 3. GET /authors/:id/sales

Returns all sales for an author's books (newest first).

**Response: 200 OK**

```json
[
  {
    "book_title": "The Silent River",
    "quantity": 40,
    "royalty_earned": 1800,
    "sale_date": "2025-01-12"
  }
]
```

### 4. POST /withdrawals

Creates a withdrawal request for an author.

**Request Body:**

```json
{
  "author_id": 1,
  "amount": 2000
}
```

**Response: 201 Created**

```json
{
  "id": 1,
  "author_id": 1,
  "amount": 2000,
  "status": "pending",
  "created_at": "2026-02-07T10:30:00.000Z",
  "new_balance": 1825
}
```

**Validation Rules:**

- Minimum withdrawal: ₹500 → Returns **400 Bad Request**
- Amount cannot exceed balance → Returns **400 Bad Request**
- Author must exist → Returns **404 Not Found**

### 5. GET /authors/:id/withdrawals

Returns withdrawal history for an author (newest first).

**Response: 200 OK**

```json
[
  {
    "id": 1,
    "amount": 2000,
    "status": "pending",
    "created_at": "2026-02-07T10:30:00.000Z"
  }
]
```

## Status Codes

| Code | Description           | Usage                   |
| ---- | --------------------- | ----------------------- |
| 200  | OK                    | Successful GET requests |
| 201  | Created               | Withdrawal created      |
| 400  | Bad Request           | Validation errors       |
| 404  | Not Found             | Author doesn't exist    |
| 500  | Internal Server Error | Server errors           |

## Key Calculations

**total_earnings:** Sum of all royalties from book sales

- Example: Priya = (65 × ₹45) + (15 × ₹60) = ₹3,825

**current_balance:** total_earnings minus withdrawals

- Initially equals total_earnings (no withdrawals)

## CORS

CORS is enabled for all origins using the `cors` package.

## Project Structure

```
src/
├── config/         # Database & environment
├── controllers/    # Request handlers
├── services/       # Business logic
├── routes/         # API routes
├── middleware/     # Error handling
├── utils/          # Database seeding
├── app.js          # Express setup
└── server.js       # Entry point
```

## Technology Stack

- **Node.js 20+** with ES Modules
- **Express.js** - Web framework
- **SQLite3** - Database
- **CORS** - Cross-origin support
