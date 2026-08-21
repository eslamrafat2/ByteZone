# ByteZone 🖥️

**ByteZone** is a full-stack e-commerce platform for browsing, comparing, and purchasing computer hardware and components.

The project is built with a modern **Angular frontend** and a **Node.js / Express backend** connected to **MongoDB**. It includes customer shopping flows, authentication, orders, reviews, and a dedicated admin dashboard.

> **Project:** ByteZone Hardware Store  
> **Repository:** https://github.com/eslamrafat2/ByteZone

---

## ✨ Features

### 🏠 Storefront

- Responsive home page
- Hero image slider with automatic transitions
- Animated hero content
- Product categories slider
- Featured products section
- Product search
- Product filtering
- Responsive product cards
- Product details pages
- Product comparison
- Responsive navigation across desktop, tablet, and mobile
- Local static product/store images included in the frontend

### 🔐 Authentication & Account

- User registration
- User login
- JWT-based authentication
- Access and refresh token flow
- Logout
- Protected routes
- Profile page
- Account dropdown in the navigation bar
- My Orders page
- Admin dashboard access for administrator accounts

### 🛒 Shopping

- Add products to cart
- Update quantities
- Remove products
- Clear cart
- Checkout flow
- Customer delivery information
- Order creation
- Order history
- Full order details and totals

### ⭐ Reviews

- Customer product reviews
- Rating and comments
- Admin review moderation
- Approve or delete reviews

### 🛠️ Admin Dashboard

- Dashboard overview
- Total products
- Total users
- Total orders
- Revenue statistics
- Recent orders
- Product management
- Create products
- Update products
- Delete products
- Product image upload
- Order management
- Update order status
- User management
- Review moderation

Supported order statuses:

```text
pending
processing
completed
cancelled
```

### 📄 Informational Pages

- Contact page
- Policy page
- Responsive footer
- Consistent responsive UI across the application

---

## 🧱 Tech Stack

### Frontend

- Angular 22
- TypeScript
- HTML5
- CSS3
- Angular Router
- Angular Forms
- RxJS
- Responsive CSS

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
- OpenAI integration
- Telegram Bot API integration

### Development Tools

- Git
- GitHub
- Visual Studio Code
- Postman
- MongoDB Compass
- npm
- Vercel for frontend deployment

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

> The exact internal folders may evolve as the project is developed. The structure above describes the main application organization.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB or a MongoDB Atlas database
- Git

Check your versions:

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

## 2. Install Backend Dependencies

```bash
cd Backend
npm install
```

---

## 3. Configure Backend Environment Variables

Create a `.env` file inside the `Backend` directory.

Example:

```env
PORT=3000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_ACCESS_SECRET=YOUR_ACCESS_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:4200
```

Add any other environment variables required by the enabled OpenAI or Telegram integrations.

**Never publish real production secrets, API keys, database credentials, or bot tokens in a public repository.**

---

## 4. Start the Backend

Development mode:

```bash
npm run dev
```

Or normal mode:

```bash
npm start
```

The local API runs on:

```text
http://localhost:3000
```

---

## 5. Install Frontend Dependencies

Open another terminal from the project root:

```bash
cd frontend
npm install
```

---

## 6. Start the Frontend

```bash
npm start
```

The Angular development server will normally be available at:

```text
http://localhost:4200
```

---

# 🔗 Main API Areas

The backend is organized around the following API areas:

| Area | Example Base Route | Purpose |
|---|---|---|
| Authentication | `/api/auth` | Registration, login, tokens, logout |
| Products | `/api/products` | Product listing, details, search, comparison, management |
| Cart | `/api/cart` | Shopping cart operations |
| Orders | `/api/orders` | Customer orders and order details |
| Admin | `/api/admin` | Dashboard, users, products, orders, reviews |
| Reviews | `/api/reviews` / admin review routes | Product reviews and moderation |

The exact endpoints should be checked against the current route files in `Backend/routes` when integrating external clients.

---

# 🔐 Security

ByteZone includes several backend security measures, including:

- Password hashing with bcryptjs
- JWT authentication
- Refresh-token handling
- Protected API routes
- Admin authorization
- HTTP-only cookies where applicable
- Helmet security headers
- CORS configuration
- Rate limiting
- Environment variables for sensitive configuration

---

# 🧪 Testing & Development

Recommended tools:

### Postman

Use Postman to test backend endpoints independently from the Angular frontend.

### MongoDB Compass

Useful for inspecting users, products, carts, orders, and other MongoDB collections during development.

### Angular Build

To verify the production frontend build:

```bash
cd frontend
npm run build
```

The generated Angular production files are written under the `dist` directory.

---

# 🌐 Deployment

## Frontend

The Angular frontend can be deployed to **Vercel** with the project root set to:

```text
frontend
```

For the current Angular production build, the generated browser output is under:

```text
frontend/dist/frontend/browser
```

## Backend

The Node.js backend can be deployed separately to a Node-compatible hosting provider.

Production environment variables should be configured through the hosting provider's environment-variable settings rather than committed to source control.

---

# 🖼️ Assets

Most static storefront images are stored locally in the Angular frontend under `frontend/public` and are bundled with the frontend deployment.

Backend-uploaded images are handled separately by the backend upload system.

---

# 📌 Project Status

🚧 **Active development**

ByteZone is being developed as a full-stack e-commerce and portfolio project. The application includes the main shopping experience, authentication, cart and checkout flows, customer orders, reviews, and administration features.

---

# 👨‍💻 Author

**Eslam Rafat**

- GitHub: https://github.com/eslamrafat2
- Project: https://github.com/eslamrafat2/ByteZone

---

# 📄 License

This project is created for **educational and portfolio purposes**.
