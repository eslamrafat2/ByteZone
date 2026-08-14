# ByteZone 🖥️

ByteZone is a full-stack e-commerce project for browsing and purchasing computer hardware and components.

The project is built with a frontend application and a Node.js backend connected to MongoDB.

---

## 🚀 Features

### User Authentication
- User registration
- User login
- JWT authentication
- Access Token
- Refresh Token
- Logout
- Protected routes

### Products
- View all products
- View product details
- Search products
- Filter products by category
- Filter products by price
- Compare products
- Admin product management
- Create products
- Update products
- Delete products

### Shopping Cart
- Add products to cart
- Update product quantity
- Remove products from cart
- Clear cart
- View current cart

### Orders
- Create orders from cart
- View user orders
- View order details
- Stock management
- Order status management

### Admin
- Admin authentication
- Dashboard statistics
- Total users
- Total products
- Total orders
- Total revenue
- Manage products
- Manage orders
- Update order status

---

## 🛠️ Technologies

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

### Tools
- Postman
- MongoDB Compass
- Git
- GitHub

---

## 📁 Project Structure

```text
ByteZone/
│
├── Frontend/
│   └── ...
│
├── Backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── productController.js
│   │   ├── cartController.js
│   │   ├── orderController.js
│   │   └── adminController.js
│   │
│   ├── middelwares/
│   │   ├── auth.middleware.js
│   │   └── admin.middleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Cart.js
│   │   └── Order.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── productRoutes.js
│   │   ├── cartRoutes.js
│   │   ├── orderRoutes.js
│   │   └── adminRoutes.js
│   │
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
└── README.md
🔐 Authentication

# 💻 ByteZone — Backend API

ByteZone is a full-stack PC Store project that provides a secure backend API for authentication, products, cart management, orders, and admin operations.

The backend is built with **Node.js**, **Express**, **MongoDB**, and **JWT Authentication**.

---

## 🔐 Authentication

ByteZone uses **JWT Authentication** with Access Tokens and Refresh Tokens.

### Access Token

Used to access protected APIs.

**Default expiration:** `15 minutes`

### Refresh Token

Used to generate a new Access Token.

**Default expiration:** `7 days`

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint                  | Description                 |
| ------ | ------------------------- | --------------------------- |
| `POST` | `/api/auth/register`      | Register a new user         |
| `POST` | `/api/auth/login`         | Login                       |
| `POST` | `/api/auth/refresh-token` | Generate a new access token |
| `POST` | `/api/auth/logout`        | Logout                      |

### Products

| Method   | Endpoint                | Description       |
| -------- | ----------------------- | ----------------- |
| `GET`    | `/api/products`         | Get all products  |
| `GET`    | `/api/products/:id`     | Get product by ID |
| `GET`    | `/api/products/compare` | Compare products  |
| `POST`   | `/api/products`         | Create a product  |
| `PUT`    | `/api/products/:id`     | Update a product  |
| `DELETE` | `/api/products/:id`     | Delete a product  |

### Cart

| Method   | Endpoint               | Description              |
| -------- | ---------------------- | ------------------------ |
| `GET`    | `/api/cart`            | Get user cart            |
| `POST`   | `/api/cart`            | Add product to cart      |
| `PUT`    | `/api/cart/:productId` | Update product quantity  |
| `DELETE` | `/api/cart/:productId` | Remove product from cart |
| `DELETE` | `/api/cart`            | Clear cart               |

### Orders

| Method | Endpoint          | Description       |
| ------ | ----------------- | ----------------- |
| `POST` | `/api/orders`     | Create an order   |
| `GET`  | `/api/orders`     | Get user orders   |
| `GET`  | `/api/orders/:id` | Get order details |

### Admin

| Method | Endpoint                | Description              |
| ------ | ----------------------- | ------------------------ |
| `GET`  | `/api/admin/dashboard`  | Get dashboard statistics |
| `GET`  | `/api/admin/orders`     | Get all orders           |
| `PUT`  | `/api/admin/orders/:id` | Update order status      |

---

## ⚙️ Installation

### 1. Clone the Repository

```bash
git clone https://github.com/eslamrafat2/ByteZone.git
```

### 2. Go to the Project

```bash
cd ByteZone
```

### 3. Go to the Backend

```bash
cd Backend
```

### 4. Install Dependencies

```bash
npm install
```

---

## 🔑 Environment Variables

Create a `.env` file inside the `Backend` folder:

```env
PORT=3000

MONGO_URI=YOUR_MONGODB_CONNECTION_STRING

JWT_ACCESS_SECRET=YOUR_ACCESS_SECRET
JWT_REFRESH_SECRET=YOUR_REFRESH_SECRET

JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

FRONTEND_URL=http://127.0.0.1:5500
```

> ⚠️ **Important:** Never upload your `.env` file to GitHub.

---

## ▶️ Run the Backend

Inside the `Backend` folder, run:

```bash
node server.js
```

The server will run on:

```text
http://localhost:3000
```

---

## 🧪 API Testing

The API can be tested using:

* **Postman**
* **MongoDB Compass**

### Recommended Testing Flow

```text
Register
   ↓
Login
   ↓
Get Products
   ↓
Add Product to Cart
   ↓
View Cart
   ↓
Create Order
   ↓
View Orders
```

---

## 🔒 Security

The project includes several security features:

* Password hashing with **bcrypt**
* **JWT Authentication**
* Protected routes
* Admin authorization
* HTTP-only Refresh Token cookie
* **CORS**
* **Helmet**
* Rate limiting
* Environment variables for sensitive information

---

## 📌 Project Status

🚧 **In Development**

The backend API has been implemented and tested using **Postman**.

### Next Step

Connect the frontend application with the backend APIs.

---

## 👨‍💻 Author

**Eslam Rafat**

GitHub:
https://github.com/eslamrafat2

---

## 📄 License

This project is created for **educational and portfolio purposes**.
