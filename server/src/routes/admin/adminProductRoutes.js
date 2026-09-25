"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const adminProductController_1 = require("../../controllers/admin/adminProductController");
const productController_1 = require("../../controllers/productController");
const router = (0, express_1.Router)();
// GET routes can reuse storefront controllers if appropriate, but with read permission
router.get('/', (0, auth_1.authorizePermission)('products.read'), productController_1.getProducts);
router.get('/:id', (0, auth_1.authorizePermission)('products.read'), productController_1.getProductById);
router.post('/', (0, auth_1.authorizePermission)('products.create'), (0, audit_1.auditLog)('CREATE', 'PRODUCT'), adminProductController_1.createAdminProduct);
router.put('/:id', (0, auth_1.authorizePermission)('products.update'), (0, audit_1.auditLog)('UPDATE', 'PRODUCT'), adminProductController_1.updateAdminProduct);
router.delete('/:id', (0, auth_1.authorizePermission)('products.delete'), (0, audit_1.auditLog)('DELETE', 'PRODUCT'), adminProductController_1.deleteAdminProduct);
router.post('/bulk-update', (0, auth_1.authorizePermission)('products.update'), (0, audit_1.auditLog)('BULK_UPDATE', 'PRODUCT'), adminProductController_1.bulkUpdateProducts);
exports.default = router;
//# sourceMappingURL=adminProductRoutes.js.map