# Eslam Store Backend API

Backend API for Eslam Store E-commerce platform built with Node.js, Express, and PostgreSQL.

## Features

- **Authentication**: JWT-based authentication with user/admin roles
- **Products**: Full CRUD operations for products
- **Cart**: Add, update, and remove items from cart
- **Orders**: Create orders, view order history, order status management
- **Security**: Rate limiting, input validation, password hashing, CORS
- **Database**: PostgreSQL with proper relations and indexes

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs
- **Validation**: express-validator
- **Security**: Helmet, CORS, Rate Limiting

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your database in `.env`:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eslam_store
DB_USER=postgres
DB_PASSWORD=your_password
```

5. Create the database and run the schema:
```bash
psql -U postgres -c "CREATE DATABASE eslam_store;"
psql -U postgres -d eslam_store -f src/database/schema.sql
```

6. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products

- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart

- `GET /api/cart` - Get user cart (protected)
- `POST /api/cart` - Add item to cart (protected)
- `PUT /api/cart` - Update cart quantity (protected)
- `DELETE /api/cart/:product_id` - Remove item from cart (protected)
- `DELETE /api/cart` - Clear cart (protected)

### Orders

- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order by ID (protected)
- `GET /api/orders/admin/all` - Get all orders (admin only)
- `PUT /api/orders/:id/status` - Update order status (admin only)

## Database Schema

### Tables

- **users**: User accounts with roles (user/admin)
- **products**: Product catalog
- **cart**: User shopping cart
- **orders**: Order information
- **order_items**: Order line items

### Relations

- users → cart (one-to-many)
- users → orders (one-to-many)
- products → cart (one-to-many)
- products → order_items (one-to-many)
- orders → order_items (one-to-many)

## Security Features

- JWT Authentication
- Password Hashing (bcrypt)
- Rate Limiting
- Input Validation
- CORS Configuration
- Helmet Security Headers

## Environment Variables

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=eslam_store
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:4200
```

## Default Admin User

Email: admin@eslamstore.com
Password: admin123 (change this in production)

## License

MIT
