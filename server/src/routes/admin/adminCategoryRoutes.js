"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const categoryController_1 = require("../../controllers/categoryController");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.authorizePermission)('categories.create'), (0, audit_1.auditLog)('CREATE', 'CATEGORY'), categoryController_1.createCategory);
router.put('/:id', (0, auth_1.authorizePermission)('categories.update'), (0, audit_1.auditLog)('UPDATE', 'CATEGORY'), categoryController_1.updateCategory);
router.delete('/:id', (0, auth_1.authorizePermission)('categories.delete'), (0, audit_1.auditLog)('DELETE', 'CATEGORY'), categoryController_1.deleteCategory);
exports.default = router;
//# sourceMappingURL=adminCategoryRoutes.js.map