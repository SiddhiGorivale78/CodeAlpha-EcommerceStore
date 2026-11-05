# CodeAlpha_EcommerceStore

Simple full-stack e-commerce store.
**Stack:** HTML, CSS, JavaScript | Node.js + Express | MongoDB (Mongoose) | JWT auth

## Features
- User registration & login (bcrypt + JWT)
- Product listing with search
- Product details page
- Shopping cart (localStorage)
- Order processing (price & stock verified on server)
- My Orders page

## Setup
1. Install Node.js and MongoDB (or use a free MongoDB Atlas URI).
2. `npm install`
3. Copy `.env.example` to `.env` and set `JWT_SECRET` (and `MONGO_URI` if needed).
4. `npm run seed`   (adds 10 sample products)
5. `npm start`  → open http://localhost:5000

## API
| Method | Endpoint | Auth |
|---|---|---|
| POST | /api/auth/register | - |
| POST | /api/auth/login | - |
| GET | /api/products?search= | - |
| GET | /api/products/:id | - |
| POST | /api/orders | Bearer token |
| GET | /api/orders/my | Bearer token |
