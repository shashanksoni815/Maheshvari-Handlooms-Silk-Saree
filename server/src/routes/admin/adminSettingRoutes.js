"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const audit_1 = require("../../middleware/audit");
const adminSettingController_1 = require("../../controllers/admin/adminSettingController");
const router = (0, express_1.Router)();
// In adminRoutes, this router is wrapped in authorizePermission('super.admin')
router.get('/', adminSettingController_1.getSettings);
router.post('/', (0, audit_1.auditLog)('UPDATE', 'SETTING'), adminSettingController_1.updateSettings);
router.delete('/:id', (0, audit_1.auditLog)('DELETE', 'SETTING'), adminSettingController_1.deleteSetting);
exports.default = router;
//# sourceMappingURL=adminSettingRoutes.js.map