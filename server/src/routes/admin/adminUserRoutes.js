"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_1 = require("../../middleware/audit");
const adminUserController_1 = require("../../controllers/admin/adminUserController");
const router = (0, express_1.Router)();
// In adminRoutes, this router is wrapped in authorizePermission('super.admin')
router.get('/', adminUserController_1.getAdminUsers);
router.post('/', (0, audit_1.auditLog)('CREATE', 'ADMIN_USER'), adminUserController_1.createAdminUser);
router.put('/:id', (0, audit_1.auditLog)('UPDATE', 'ADMIN_USER'), adminUserController_1.updateAdminUser);
router.delete('/:id', (0, audit_1.auditLog)('DELETE', 'ADMIN_USER'), adminUserController_1.deleteAdminUser);
exports.default = router;
//# sourceMappingURL=adminUserRoutes.js.map