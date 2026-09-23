import { Router } from 'express';
import { protect, authorize, authorizePermission } from '../middleware/auth';
import { auditLog } from '../middleware/audit';

import adminProductRoutes from './admin/adminProductRoutes';
import adminCategoryRoutes from './admin/adminCategoryRoutes';
import adminCollectionRoutes from './admin/adminCollectionRoutes';
import adminInventoryRoutes from './admin/adminInventoryRoutes';
import adminOrderRoutes from './admin/adminOrderRoutes';
import adminCustomerRoutes from './admin/adminCustomerRoutes';
import adminReviewRoutes from './admin/adminReviewRoutes';
import adminCouponRoutes from './admin/adminCouponRoutes';
import adminBlogRoutes from './admin/adminBlogRoutes';
import adminCmsRoutes from './admin/adminCmsRoutes';
import adminBannerRoutes from './admin/adminBannerRoutes';
import adminUserRoutes from './admin/adminUserRoutes';
import adminRoleRoutes from './admin/adminRoleRoutes';
import adminAuditLogRoutes from './admin/adminAuditLogRoutes';
import adminSettingRoutes from './admin/adminSettingRoutes';
const router = Router();

// All routes here are protected and require at least 'ADMIN' role initially (though authorizePermission handles specific capabilities)
router.use(protect, authorize('ADMIN', 'SUPER_ADMIN'));

router.use('/products', adminProductRoutes);
router.use('/categories', adminCategoryRoutes);
router.use('/collections', adminCollectionRoutes);
router.use('/inventory', adminInventoryRoutes);
router.use('/orders', adminOrderRoutes);
router.use('/customers', adminCustomerRoutes);
router.use('/reviews', adminReviewRoutes);
router.use('/coupons', adminCouponRoutes);
router.use('/blog', adminBlogRoutes);
router.use('/cms', adminCmsRoutes);
router.use('/banners', adminBannerRoutes);

// Super Admin restricted routes
router.use('/admin-users', authorizePermission('super.admin'), adminUserRoutes);
router.use('/roles', authorizePermission('super.admin'), adminRoleRoutes);
router.use('/audit-logs', authorizePermission('super.admin'), adminAuditLogRoutes);
router.use('/settings', authorizePermission('super.admin'), adminSettingRoutes);

export default router;
