import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Public pages
import Home               from './pages/Home';
import Apply              from './pages/Apply';

// Auth pages
import AdminLogin         from './pages/admin/AdminLogin';
import CustomerLogin      from './pages/customer/CustomerLogin';
import CustomerRegister   from './pages/customer/CustomerRegister';
import MerchantLogin      from './pages/merchant/MerchantLogin';
import MerchantRegister   from './pages/merchant/MerchantRegister';

// Admin pages
import AdminDashboard     from './pages/admin/AdminDashboard';
import AdminApplications  from './pages/admin/AdminApplications';
import AdminCustomers     from './pages/admin/AdminCustomers';
import AdminMerchants     from './pages/admin/AdminMerchants';

// Customer pages
import CustomerDashboard  from './pages/customer/CustomerDashboard';
import CustomerCard       from './pages/customer/CustomerCard';
import CustomerProducts   from './pages/customer/CustomerProducts';
import CustomerRepay      from './pages/customer/CustomerRepay';
import CustomerTransactions from './pages/customer/CustomerTransactions';

// Merchant pages
import MerchantDashboard  from './pages/merchant/MerchantDashboard';
import MerchantProducts   from './pages/merchant/MerchantProducts';
import AddProduct         from './pages/merchant/AddProduct';

const PrivateRoute = ({ children, role }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/"     element={<Home />} />
          <Route path="/apply" element={<Apply />} />

          {/* Auth */}
          <Route path="/admin/login"          element={<AdminLogin />} />
          <Route path="/customer/login"       element={<CustomerLogin />} />
          <Route path="/customer/register"    element={<CustomerRegister />} />
          <Route path="/merchant/login"       element={<MerchantLogin />} />
          <Route path="/merchant/register"    element={<MerchantRegister />} />

          {/* Admin */}
          <Route path="/admin/dashboard"    element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
          <Route path="/admin/applications" element={<PrivateRoute role="admin"><AdminApplications /></PrivateRoute>} />
          <Route path="/admin/customers"    element={<PrivateRoute role="admin"><AdminCustomers /></PrivateRoute>} />
          <Route path="/admin/merchants"    element={<PrivateRoute role="admin"><AdminMerchants /></PrivateRoute>} />

          {/* Customer */}
          <Route path="/customer/dashboard"    element={<PrivateRoute role="customer"><CustomerDashboard /></PrivateRoute>} />
          <Route path="/customer/card"         element={<PrivateRoute role="customer"><CustomerCard /></PrivateRoute>} />
          <Route path="/customer/products"     element={<PrivateRoute role="customer"><CustomerProducts /></PrivateRoute>} />
          <Route path="/customer/repay"        element={<PrivateRoute role="customer"><CustomerRepay /></PrivateRoute>} />
          <Route path="/customer/transactions" element={<PrivateRoute role="customer"><CustomerTransactions /></PrivateRoute>} />

          {/* Merchant */}
          <Route path="/merchant/dashboard"   element={<PrivateRoute role="merchant"><MerchantDashboard /></PrivateRoute>} />
          <Route path="/merchant/products"    element={<PrivateRoute role="merchant"><MerchantProducts /></PrivateRoute>} />
          <Route path="/merchant/add-product" element={<PrivateRoute role="merchant"><AddProduct /></PrivateRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
