"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const adminOrderController_1 = require("../../controllers/admin/adminOrderController");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.authorizePermission)('orders.read'), adminOrderController_1.getAdminOrders);
router.get('/:id', (0, auth_1.authorizePermission)('orders.read'), adminOrderController_1.getAdminOrderById);
router.put('/:id/status', (0, auth_1.authorizePermission)('orders.update'), (0, audit_1.auditLog)('UPDATE_STATUS', 'ORDER'), adminOrderController_1.updateOrderStatus);
router.post('/:id/refund', (0, auth_1.authorizePermission)('orders.refund'), (0, audit_1.auditLog)('REFUND', 'ORDER'), adminOrderController_1.issueRefund);
exports.default = router;
//# sourceMappingURL=adminOrderRoutes.js.map