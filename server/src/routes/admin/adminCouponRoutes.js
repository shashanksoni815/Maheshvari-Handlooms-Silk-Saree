"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const couponController_1 = require("../../controllers/couponController");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.authorizePermission)('coupons.read'), couponController_1.getCoupons);
router.post('/', (0, auth_1.authorizePermission)('coupons.create'), (0, audit_1.auditLog)('CREATE', 'COUPON'), couponController_1.createCoupon);
router.put('/:id', (0, auth_1.authorizePermission)('coupons.update'), (0, audit_1.auditLog)('UPDATE', 'COUPON'), couponController_1.updateCoupon);
router.delete('/:id', (0, auth_1.authorizePermission)('coupons.delete'), (0, audit_1.auditLog)('DELETE', 'COUPON'), couponController_1.deleteCoupon);
exports.default = router;
//# sourceMappingURL=adminCouponRoutes.js.map