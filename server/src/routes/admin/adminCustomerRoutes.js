"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const adminCustomerController_1 = require("../../controllers/admin/adminCustomerController");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.authorizePermission)('customers.read'), adminCustomerController_1.getCustomers);
router.get('/:id', (0, auth_1.authorizePermission)('customers.read'), adminCustomerController_1.getCustomerById);
router.put('/:id/status', (0, auth_1.authorizePermission)('customers.update'), adminCustomerController_1.updateCustomerStatus);
exports.default = router;
//# sourceMappingURL=adminCustomerRoutes.js.map