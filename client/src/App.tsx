import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfirmationModalProvider } from './components/admin/ConfirmationModal';
import { AdminRoute } from './features/auth/AdminRoute';
import { AdminPermissionRoute } from './features/auth/AdminPermissionRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { StorefrontLayout } from './layouts/StorefrontLayout';
import { ProtectedRoute } from './features/auth/ProtectedRoute';
import { Loader } from './components/common/Loader';

const Dashboard = React.lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.Dashboard })));
const Products = React.lazy(() => import('./pages/admin/Products').then(m => ({ default: m.Products })));
const ProductForm = React.lazy(() => import('./pages/admin/ProductForm').then(m => ({ default: m.ProductForm })));
const Orders = React.lazy(() => import('./pages/admin/Orders').then(m => ({ default: m.Orders })));
const OrderDetail = React.lazy(() => import('./pages/admin/OrderDetail').then(m => ({ default: m.OrderDetail })));
const Customers = React.lazy(() => import('./pages/admin/Customers').then(m => ({ default: m.Customers })));
const CustomerDetail = React.lazy(() => import('./pages/admin/CustomerDetail').then(m => ({ default: m.CustomerDetail })));
const Coupons = React.lazy(() => import('./pages/admin/Coupons').then(m => ({ default: m.Coupons })));
const Categories = React.lazy(() => import('./pages/admin/Categories').then(m => ({ default: m.Categories })));
const AdminCollections = React.lazy(() => import('./pages/admin/Collections').then(m => ({ default: m.Collections })));
const Inventory = React.lazy(() => import('./pages/admin/Inventory').then(m => ({ default: m.Inventory })));
const Reviews = React.lazy(() => import('./pages/admin/Reviews').then(m => ({ default: m.Reviews })));
const Blog = React.lazy(() => import('./pages/admin/Blog').then(m => ({ default: m.Blog })));
const Banners = React.lazy(() => import('./pages/admin/Banners').then(m => ({ default: m.Banners })));
const CMSManager = React.lazy(() => import('./pages/admin/CMSManager').then(m => ({ default: m.CMSManager })));
const AdminUsers = React.lazy(() => import('./pages/admin/AdminUsers').then(m => ({ default: m.AdminUsers })));
const AuditLogs = React.lazy(() => import('./pages/admin/AuditLogs').then(m => ({ default: m.AuditLogs })));
const Roles = React.lazy(() => import('./pages/admin/Roles').then(m => ({ default: m.Roles })));
const Reports = React.lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.Reports })));
const Settings = React.lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.Settings })));

const LoginForm = React.lazy(() => import('./features/auth/LoginForm').then(m => ({ default: m.LoginForm })));
const RegisterForm = React.lazy(() => import('./features/auth/RegisterForm').then(m => ({ default: m.RegisterForm })));
const ForgotPassword = React.lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = React.lazy(() => import('./pages/auth/ResetPassword'));
const Home = React.lazy(() => import('./pages/storefront/Home').then(m => ({ default: m.Home })));
const Shop = React.lazy(() => import('./pages/storefront/Shop').then(m => ({ default: m.Shop })));
const ProductDetail = React.lazy(() => import('./pages/storefront/ProductDetail').then(m => ({ default: m.ProductDetail })));
const Cart = React.lazy(() => import('./pages/storefront/Cart').then(m => ({ default: m.Cart })));
const Checkout = React.lazy(() => import('./pages/storefront/Checkout').then(m => ({ default: m.Checkout })));
const Account = React.lazy(() => import('./pages/storefront/Account').then(m => ({ default: m.Account })));
const Wishlist = React.lazy(() => import('./pages/storefront/Wishlist').then(m => ({ default: m.Wishlist })));
const Journal = React.lazy(() => import('./pages/storefront/Journal').then(m => ({ default: m.Journal })));
const JournalArticle = React.lazy(() => import('./pages/storefront/JournalArticle').then(m => ({ default: m.JournalArticle })));
const ShippingPolicy = React.lazy(() => import('./pages/storefront/PolicyPages').then(m => ({ default: m.ShippingPolicy })));
const CancellationPolicy = React.lazy(() => import('./pages/storefront/PolicyPages').then(m => ({ default: m.CancellationPolicy })));
const RefundPolicy = React.lazy(() => import('./pages/storefront/PolicyPages').then(m => ({ default: m.RefundPolicy })));
const PrivacyPolicy = React.lazy(() => import('./pages/storefront/PolicyPages').then(m => ({ default: m.PrivacyPolicy })));
const TermsAndConditions = React.lazy(() => import('./pages/storefront/PolicyPages').then(m => ({ default: m.TermsAndConditions })));
const CareGuide = React.lazy(() => import('./pages/storefront/PolicyPages').then(m => ({ default: m.CareGuide })));
const OrderSuccess = React.lazy(() => import('./pages/storefront/OrderSuccess').then(m => ({ default: m.OrderSuccess })));
const Contact = React.lazy(() => import('./pages/storefront/Contact').then(m => ({ default: m.Contact })));
const Faq = React.lazy(() => import('./pages/storefront/Faq').then(m => ({ default: m.Faq })));
const NotFound = React.lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const Collections = React.lazy(() => import('./pages/storefront/Collections').then(m => ({ default: m.Collections })));
const CollectionDetail = React.lazy(() => import('./pages/storefront/CollectionDetail').then(m => ({ default: m.CollectionDetail })));
const AboutUs = React.lazy(() => import('./pages/storefront/AboutUs').then(m => ({ default: m.AboutUs })));
const Stores = React.lazy(() => import('./pages/storefront/Stores').then(m => ({ default: m.Stores })));
const AccountProfile = React.lazy(() => import('./pages/storefront/AccountSubPages').then(m => ({ default: m.AccountProfile })));
const AccountOrders = React.lazy(() => import('./pages/storefront/AccountSubPages').then(m => ({ default: m.AccountOrders })));
const AccountOrderDetails = React.lazy(() => import('./pages/storefront/AccountSubPages').then(m => ({ default: m.AccountOrderDetails })));
const AccountOrderTracking = React.lazy(() => import('./pages/storefront/AccountSubPages').then(m => ({ default: m.AccountOrderTracking })));
const AccountAddresses = React.lazy(() => import('./pages/storefront/AccountSubPages').then(m => ({ default: m.AccountAddresses })));
const AccountWishlist = React.lazy(() => import('./pages/storefront/AccountSubPages').then(m => ({ default: m.AccountWishlist })));
const AccountReviews = React.lazy(() => import('./pages/storefront/AccountSubPages').then(m => ({ default: m.AccountReviews })));

const App = () => {
  return (
    <BrowserRouter>
      <ConfirmationModalProvider>
        <Suspense fallback={<Loader />}>
          <Routes>
          {/* Storefront Routes */}
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/sarees" element={<Shop />} />
          <Route path="/sarees/:category" element={<Shop />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/collections/:slug" element={<CollectionDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success/:id" element={<OrderSuccess />} />
            
            <Route path="/account" element={<Account />}>
              <Route index element={<Navigate to="profile" replace />} />
              <Route path="profile" element={<AccountProfile />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="orders/:orderId" element={<AccountOrderDetails />} />
              <Route path="orders/:orderId/track" element={<AccountOrderTracking />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="reviews" element={<AccountReviews />} />
            </Route>
            
            <Route path="/wishlist" element={<Wishlist />} />
          </Route>
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/care-guide" element={<CareGuide />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="/resetpassword/:resettoken" element={<ResetPassword />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AdminPermissionRoute permission="dashboard.read"><Dashboard /></AdminPermissionRoute>} />
            <Route path="products" element={<AdminPermissionRoute permission="products.read"><Products /></AdminPermissionRoute>} />
            <Route path="products/new" element={<AdminPermissionRoute permission="products.create"><ProductForm /></AdminPermissionRoute>} />
            <Route path="products/:id/edit" element={<AdminPermissionRoute permission="products.update"><ProductForm /></AdminPermissionRoute>} />
            <Route path="orders" element={<AdminPermissionRoute permission="orders.read"><Orders /></AdminPermissionRoute>} />
            <Route path="orders/:id" element={<AdminPermissionRoute permission="orders.read"><OrderDetail /></AdminPermissionRoute>} />
            <Route path="categories" element={<AdminPermissionRoute permission="categories.read"><Categories /></AdminPermissionRoute>} />
            <Route path="collections" element={<AdminPermissionRoute permission="collections.read"><AdminCollections /></AdminPermissionRoute>} />
            <Route path="inventory" element={<AdminPermissionRoute permission="inventory.read"><Inventory /></AdminPermissionRoute>} />
            <Route path="customers" element={<AdminPermissionRoute permission="customers.read"><Customers /></AdminPermissionRoute>} />
            <Route path="customers/:id" element={<AdminPermissionRoute permission="customers.read"><CustomerDetail /></AdminPermissionRoute>} />
            <Route path="reviews" element={<AdminPermissionRoute permission="reviews.read"><Reviews /></AdminPermissionRoute>} />
            <Route path="coupons" element={<AdminPermissionRoute permission="coupons.read"><Coupons /></AdminPermissionRoute>} />
            <Route path="blog" element={<AdminPermissionRoute permission="blog.read"><Blog /></AdminPermissionRoute>} />
            <Route path="banners" element={<AdminPermissionRoute permission="banners.read"><Banners /></AdminPermissionRoute>} />
            <Route path="cms" element={<AdminPermissionRoute permission="cms.read"><CMSManager /></AdminPermissionRoute>} />
            <Route path="reports" element={<AdminPermissionRoute permission="reports.read"><Reports /></AdminPermissionRoute>} />
            {/* Super Admin Routes */}
            <Route path="admin-users" element={<AdminPermissionRoute permission="super.admin"><AdminUsers /></AdminPermissionRoute>} />
            <Route path="audit-logs" element={<AdminPermissionRoute permission="super.admin"><AuditLogs /></AdminPermissionRoute>} />
            <Route path="roles" element={<AdminPermissionRoute permission="super.admin"><Roles /></AdminPermissionRoute>} />
            <Route path="settings" element={<AdminPermissionRoute permission="super.admin"><Settings /></AdminPermissionRoute>} />
          </Route>
        </Route>

          <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ConfirmationModalProvider>
    </BrowserRouter>
  );
};

export default App;
