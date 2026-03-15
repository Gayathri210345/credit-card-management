# CCAMS — Credit Card Application Management System
### MERN Stack (MongoDB + Express + React + Node.js)

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js v16+
- MongoDB (local or MongoDB Atlas)

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env and set your MONGO_URI and JWT_SECRET
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Create Admin Account (First Time Only)
Visit this URL in your browser or use Postman:
```
POST http://localhost:5000/api/auth/admin/seed
```
This creates:  **Username: admin | Password: admin123**

---

## 👥 User Roles

| Role | Flow |
|------|------|
| **Admin** | Login → Dashboard → View/Approve/Reject applications |
| **Customer** | Apply → Get approved → Register → Login → Shop / Repay |
| **Merchant** | Register → Login → Add products → View sales |

---

## 📁 Project Structure

```
ccams/
├── backend/
│   ├── models/         # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── Application.js
│   │   ├── Customer.js
│   │   ├── Merchant.js
│   │   ├── Product.js
│   │   └── Transaction.js
│   ├── routes/         # Express API routes
│   │   ├── auth.js
│   │   ├── admin.js
│   │   ├── customer.js
│   │   └── merchant.js
│   ├── middleware/
│   │   └── auth.js     # JWT protect middleware
│   ├── server.js
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.js
        ├── api.js
        ├── index.js / index.css
        ├── context/
        │   └── AuthContext.js
        ├── components/
        │   ├── Alert.js
        │   ├── Badge.js
        │   ├── Button.js
        │   ├── Card.js
        │   ├── Input.js
        │   ├── Layout.js
        │   ├── Sidebar.js
        │   ├── StatCard.js
        │   └── Table.js
        └── pages/
            ├── Home.js
            ├── Apply.js
            ├── admin/
            │   ├── AdminLogin.js
            │   ├── AdminDashboard.js
            │   ├── AdminApplications.js
            │   ├── AdminCustomers.js
            │   └── AdminMerchants.js
            ├── customer/
            │   ├── CustomerLogin.js
            │   ├── CustomerRegister.js
            │   ├── CustomerDashboard.js
            │   ├── CustomerCard.js
            │   ├── CustomerProducts.js
            │   ├── CustomerRepay.js
            │   └── CustomerTransactions.js
            └── merchant/
                ├── MerchantLogin.js
                ├── MerchantRegister.js
                ├── MerchantDashboard.js
                ├── MerchantProducts.js
                └── AddProduct.js
```

---

## 🔌 API Endpoints

### Auth (Public)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/auth/admin/seed | Create default admin (run once) |
| POST | /api/auth/admin/login | Admin login |
| POST | /api/auth/customer/register | Customer register (approved only) |
| POST | /api/auth/customer/login | Customer login |
| POST | /api/auth/merchant/register | Merchant register |
| POST | /api/auth/merchant/login | Merchant login |

### Admin (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/admin/dashboard | Stats overview |
| GET | /api/admin/applications | All applications |
| PATCH | /api/admin/applications/:id/status | Approve/Reject |
| GET | /api/admin/customers | All customers |
| GET | /api/admin/merchants | All merchants |

### Customer (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| POST | /api/customer/apply | Submit CC application |
| GET | /api/customer/application | My application status |
| GET | /api/customer/dashboard | Credit info |
| GET | /api/customer/products | Browse products |
| POST | /api/customer/purchase | Buy a product |
| POST | /api/customer/repay | Make repayment |
| GET | /api/customer/transactions | Transaction history |

### Merchant (Protected)
| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/merchant/dashboard | Sales overview |
| GET | /api/merchant/products | My products |
| POST | /api/merchant/products | Add product |
| PUT | /api/merchant/products/:id | Update product |
| DELETE | /api/merchant/products/:id | Delete product |

---

## 💡 Credit Limit Formula
```
Credit Limit = Annual Income × 3
Available Credit = Credit Limit - (Total Purchases - Total Repayments)
```

## 🔐 Default Admin
After running the seed endpoint:
- **Username:** admin
- **Password:** admin123

---
*Converted from PHP to MERN Stack by Claude*
