"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const adminBannerController_1 = require("../../controllers/admin/adminBannerController");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.authorizePermission)('banners.read'), adminBannerController_1.getBanners);
router.post('/', (0, auth_1.authorizePermission)('banners.update'), (0, audit_1.auditLog)('CREATE', 'BANNER'), adminBannerController_1.createBanner);
router.put('/:id', (0, auth_1.authorizePermission)('banners.update'), (0, audit_1.auditLog)('UPDATE', 'BANNER'), adminBannerController_1.updateBanner);
router.delete('/:id', (0, auth_1.authorizePermission)('banners.update'), (0, audit_1.auditLog)('DELETE', 'BANNER'), adminBannerController_1.deleteBanner);
exports.default = router;
//# sourceMappingURL=adminBannerRoutes.js.map