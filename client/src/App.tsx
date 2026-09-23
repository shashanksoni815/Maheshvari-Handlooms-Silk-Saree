import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfirmationModalProvider } from './components/admin/ConfirmationModal';
import { AdminRoute } from './features/auth/AdminRoute';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { Products } from './pages/admin/Products';
import { ProductForm } from './pages/admin/ProductForm';
import { Orders } from './pages/admin/Orders';
import { OrderDetail } from './pages/admin/OrderDetail';
import { Customers } from './pages/admin/Customers';
import { CustomerDetail } from './pages/admin/CustomerDetail';
import { Coupons } from './pages/admin/Coupons';
import { Categories } from './pages/admin/Categories';
import { Collections as AdminCollections } from './pages/admin/Collections';
import { Inventory } from './pages/admin/Inventory';
import { Reviews } from './pages/admin/Reviews';
import { Blog } from './pages/admin/Blog';
import { Banners } from './pages/admin/Banners';
import { CMSManager } from './pages/admin/CMSManager';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AuditLogs } from './pages/admin/AuditLogs';
import { Roles } from './pages/admin/Roles';
import { Reports } from './pages/admin/Reports';
import { Settings } from './pages/admin/Settings';

import { LoginForm } from './features/auth/LoginForm';
import { RegisterForm } from './features/auth/RegisterForm';
import { StorefrontLayout } from './layouts/StorefrontLayout';
import { Home } from './pages/storefront/Home';
import { Shop } from './pages/storefront/Shop';
import { ProductDetail } from './pages/storefront/ProductDetail';
import { Cart } from './pages/storefront/Cart';
import { Checkout } from './pages/storefront/Checkout';
import { Account } from './pages/storefront/Account';
import { Wishlist } from './pages/storefront/Wishlist';
import { Journal } from './pages/storefront/Journal';
import { JournalArticle } from './pages/storefront/JournalArticle';
import { ShippingPolicy, CancellationPolicy, PrivacyPolicy, TermsAndConditions, CareGuide } from './pages/storefront/PolicyPages';
import { OrderSuccess } from './pages/storefront/OrderSuccess';
import { Contact } from './pages/storefront/Contact';
import { Faq } from './pages/storefront/Faq';
import { NotFound } from './pages/NotFound';

import { Collections } from './pages/storefront/Collections';
import { CollectionDetail } from './pages/storefront/CollectionDetail';
import { AboutUs } from './pages/storefront/AboutUs';
import { Stores } from './pages/storefront/Stores';
import { 
  AccountProfile, 
  AccountOrders, 
  AccountOrderDetails, 
  AccountAddresses, 
  AccountWishlist, 
  AccountReviews 
} from './pages/storefront/AccountSubPages';

const App = () => {
  return (
    <BrowserRouter>
      <ConfirmationModalProvider>
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
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-success/:id" element={<OrderSuccess />} />
          
          <Route path="/account" element={<Account />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="orders/:orderId" element={<AccountOrderDetails />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="reviews" element={<AccountReviews />} />
          </Route>
          
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/journal/:slug" element={<JournalArticle />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/stores" element={<Stores />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/cancellation-policy" element={<CancellationPolicy />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/care-guide" element={<CareGuide />} />
        </Route>

        {/* Auth Routes */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegisterForm />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id/edit" element={<ProductForm />} />
            <Route path="orders" element={<Orders />} />
            <Route path="orders/:id" element={<OrderDetail />} />
            <Route path="categories" element={<Categories />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="blog" element={<Blog />} />
            <Route path="banners" element={<Banners />} />
            <Route path="cms" element={<CMSManager />} />
            <Route path="reports" element={<Reports />} />
            {/* Super Admin Routes */}
            <Route path="admin-users" element={<AdminUsers />} />
            <Route path="audit-logs" element={<AuditLogs />} />
            <Route path="roles" element={<Roles />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
        </Routes>
      </ConfirmationModalProvider>
    </BrowserRouter>
  );
};

export default App;
