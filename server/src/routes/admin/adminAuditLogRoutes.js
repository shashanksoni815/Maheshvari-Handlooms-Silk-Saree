"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const adminAuditLogController_1 = require("../../controllers/admin/adminAuditLogController");
const router = (0, express_1.Router)();
// In adminRoutes, this router is wrapped in authorizePermission('super.admin')
router.get('/', adminAuditLogController_1.getAuditLogs);
exports.default = router;
//# sourceMappingURL=adminAuditLogRoutes.js.map