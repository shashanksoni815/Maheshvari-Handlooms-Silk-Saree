"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const adminInventoryController_1 = require("../../controllers/admin/adminInventoryController");
const router = (0, express_1.Router)();
router.post('/adjust', (0, auth_1.authorizePermission)('inventory.adjust'), (0, audit_1.auditLog)('ADJUST', 'INVENTORY'), adminInventoryController_1.adjustInventory);
router.get('/history', (0, auth_1.authorizePermission)('inventory.read'), adminInventoryController_1.getInventoryHistory);
exports.default = router;
//# sourceMappingURL=adminInventoryRoutes.js.map