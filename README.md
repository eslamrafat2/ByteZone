# ByteZone 🖥️

**ByteZone** is a full-stack e-commerce platform for browsing, comparing, and purchasing computer hardware and components.

Built with **Angular**, **Node.js / Express**, and **MongoDB**, ByteZone provides a complete shopping experience with authentication, cart and checkout, orders, reviews, product comparison, image uploads, and an admin dashboard.

> **Repository:** https://github.com/eslamrafat2/ByteZone

---

## ✨ Features

### 🛍️ Storefront

- Responsive home page
- Hero slider with automatic transitions
- Product categories
- Featured products
- Product search and filtering
- Brand and category filtering
- Price and availability filters
- Product sorting
- Product details pages
- Product comparison
- Responsive product cards
- Responsive navigation and footer

### 🔐 Authentication

- User registration and login
- JWT-based authentication
- Access and refresh token flow
- Logout
- Protected routes
- User profile
- My Orders
- Role-based admin access

### 🛒 Shopping & Checkout

- Add products to cart
- Update quantities
- Remove products
- Clear cart
- Checkout flow
- Customer delivery information
- Order creation
- Order history
- Order details and totals

### ⭐ Reviews

- Product ratings and comments
- Review eligibility checks
- Admin review moderation
- Approve or delete reviews

### ⚖️ Product Comparison

- Compare up to 4 products
- Compare price, brand, category, stock, and dynamic specifications
- Highlight differences between products
- View product details directly from comparison

### 🛠️ Admin Dashboard

- Dashboard overview
- Product management
- Create, edit, and delete products
- Product image upload
- Dynamic product specifications
- Order management
- Update order status
- User management
- Review moderation
- Sales and revenue overview

### 🤖 Integrations

- OpenAI integration
- Telegram Bot API integration

---

## 🧱 Tech Stack

### Frontend

- Angular 22
- TypeScript
- HTML5
- CSS3
- Angular Router
- Angular Reactive Forms
- RxJS

### Backend

- Node.js
- Express 5
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Multer
- Helmet
- CORS
- Express Rate Limit
- Cookie Parser
- dotenv

### Tools & Deployment

- Git / GitHub
- Visual Studio Code
- Postman
- MongoDB Compass
- npm
- Vercel — Frontend
- Render — Backend

---

## 📁 Project Structure

```text
ByteZone/
│
├── Backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── uploads/
│   ├── .env
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout/
│   │   │   ├── pages/
│   │   │   ├── services/
│   │   │   └── shared/
│   │   ├── main.ts
│   │   └── styles.css
│   ├── angular.json
│   ├── package.json
│   └── tsconfig.json
│
├── .gitignore
└── README.md
```

---

# 🚀 Local Setup

## Prerequisites

Install:

- Node.js
- npm
- Git
- MongoDB or MongoDB Atlas

Verify installation:

```bash
node -v
npm -v
git --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/eslamrafat2/ByteZone.git
cd ByteZone
```

---

## 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`.

Example configuration:

```env
PORT=3000
MONGO_URI=YOUR_MONGODB_CONNECTION_STRING
JWT_ACCESS_SECRET=YOUR_ACCESS_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:4200
```

Add any additional variables required by the enabled integrations.

Start the backend:

```bash
npm run dev
```

Or:

```bash
npm start
```

Local backend:

```text
http://localhost:3000
```

---

## 3. Frontend Setup

Open a second terminal from the project root:

```bash
cd frontend
npm install
```

Start Angular:

```bash
npm start
```

Local frontend:

```text
http://localhost:4200
```

---

# 🔗 API Overview

| Area | Base Route | Description |
|---|---|---|
| Authentication | `/api/auth` | Registration, login, logout, tokens |
| Products | `/api/products` | Products, search, details, comparison |
| Cart | `/api/cart` | Cart operations |
| Orders | `/api/orders` | Customer orders |
| Admin | `/api/admin` | Products, users, orders, dashboard |
| Reviews | `/api/reviews` | Product reviews and moderation |

For exact endpoints, refer to the route files in `Backend/routes/`.

---

# 🖼️ Product Images

ByteZone supports two types of product images:

1. **Static product images** stored in the Angular frontend under `frontend/public/images/products`.
2. **Uploaded product images** handled by the backend upload system under `/uploads`.

Uploaded images use the Render backend in production and the local backend during local development, so the same source code can be used locally and in production.

---

# 🧪 Build & Verification

Build the Angular frontend:

```bash
cd frontend
npm run build
```

The production output is generated under:

```text
frontend/dist/frontend/browser
```

For backend API testing, Postman is recommended.

---

# 🌐 Deployment

## Frontend — Vercel

The frontend is deployed as an Angular application.

Vercel project root:

```text
frontend
```

Production build:

```bash
npm run build
```

## Backend — Render

The backend runs as a Node.js service on Render.

Production environment variables should be configured through Render's Environment settings rather than hard-coded in the source code.

---

# 🔒 Security Notes

- Never expose real database credentials, JWT secrets, API keys, or bot tokens in a public repository.
- Use environment variables for sensitive configuration.
- Do not commit production secrets.
- Keep backend authentication and admin routes protected.

---

# 📌 Project Status

**Active development** 🚧

ByteZone is a full-stack hardware e-commerce project developed for educational, practical, and portfolio purposes.

---

# 👨‍💻 Author

**Eslam Rafat**

- GitHub: https://github.com/eslamrafat2
- Repository: https://github.com/eslamrafat2/ByteZone

---

# 📄 License

This project is intended for **educational and portfolio purposes**.
