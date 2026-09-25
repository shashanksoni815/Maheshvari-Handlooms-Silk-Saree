"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_1 = require("../../middleware/audit");
const adminRoleController_1 = require("../../controllers/admin/adminRoleController");
const router = (0, express_1.Router)();
// Only super admins should manage roles, but we'll use a specific permission 'roles.manage' or hardcode 'super.admin'
// In adminRoutes, this router is wrapped in authorizePermission('super.admin')
router.get('/', adminRoleController_1.getRoles);
router.post('/', (0, audit_1.auditLog)('CREATE', 'ROLE'), adminRoleController_1.createRole);
router.put('/:id', (0, audit_1.auditLog)('UPDATE', 'ROLE'), adminRoleController_1.updateRole);
router.delete('/:id', (0, audit_1.auditLog)('DELETE', 'ROLE'), adminRoleController_1.deleteRole);
exports.default = router;
//# sourceMappingURL=adminRoleRoutes.js.map