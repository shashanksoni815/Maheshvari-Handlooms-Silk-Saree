"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const adminProductRoutes_1 = __importDefault(require("./admin/adminProductRoutes"));
const adminCategoryRoutes_1 = __importDefault(require("./admin/adminCategoryRoutes"));
const adminCollectionRoutes_1 = __importDefault(require("./admin/adminCollectionRoutes"));
const adminInventoryRoutes_1 = __importDefault(require("./admin/adminInventoryRoutes"));
const adminOrderRoutes_1 = __importDefault(require("./admin/adminOrderRoutes"));
const adminCustomerRoutes_1 = __importDefault(require("./admin/adminCustomerRoutes"));
const adminReviewRoutes_1 = __importDefault(require("./admin/adminReviewRoutes"));
const adminCouponRoutes_1 = __importDefault(require("./admin/adminCouponRoutes"));
const adminBlogRoutes_1 = __importDefault(require("./admin/adminBlogRoutes"));
const adminCmsRoutes_1 = __importDefault(require("./admin/adminCmsRoutes"));
const adminBannerRoutes_1 = __importDefault(require("./admin/adminBannerRoutes"));
const adminUserRoutes_1 = __importDefault(require("./admin/adminUserRoutes"));
const adminRoleRoutes_1 = __importDefault(require("./admin/adminRoleRoutes"));
const adminAuditLogRoutes_1 = __importDefault(require("./admin/adminAuditLogRoutes"));
const adminSettingRoutes_1 = __importDefault(require("./admin/adminSettingRoutes"));
const router = (0, express_1.Router)();
// All routes here are protected and require at least 'ADMIN' role initially (though authorizePermission handles specific capabilities)
router.use(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'));
router.use('/products', adminProductRoutes_1.default);
router.use('/categories', adminCategoryRoutes_1.default);
router.use('/collections', adminCollectionRoutes_1.default);
router.use('/inventory', adminInventoryRoutes_1.default);
router.use('/orders', adminOrderRoutes_1.default);
router.use('/customers', adminCustomerRoutes_1.default);
router.use('/reviews', adminReviewRoutes_1.default);
router.use('/coupons', adminCouponRoutes_1.default);
router.use('/blog', adminBlogRoutes_1.default);
router.use('/cms', adminCmsRoutes_1.default);
router.use('/banners', adminBannerRoutes_1.default);
// Super Admin restricted routes
router.use('/admin-users', (0, auth_1.authorizePermission)('super.admin'), adminUserRoutes_1.default);
router.use('/roles', (0, auth_1.authorizePermission)('super.admin'), adminRoleRoutes_1.default);
router.use('/audit-logs', (0, auth_1.authorizePermission)('super.admin'), adminAuditLogRoutes_1.default);
router.use('/settings', (0, auth_1.authorizePermission)('super.admin'), adminSettingRoutes_1.default);
exports.default = router;
//# sourceMappingURL=adminRoutes.js.map