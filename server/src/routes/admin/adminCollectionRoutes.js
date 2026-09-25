"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const collectionController_1 = require("../../controllers/collectionController");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.authorizePermission)('collections.create'), (0, audit_1.auditLog)('CREATE', 'COLLECTION'), collectionController_1.createCollection);
router.put('/:id', (0, auth_1.authorizePermission)('collections.update'), (0, audit_1.auditLog)('UPDATE', 'COLLECTION'), collectionController_1.updateCollection);
router.delete('/:id', (0, auth_1.authorizePermission)('collections.delete'), (0, audit_1.auditLog)('DELETE', 'COLLECTION'), collectionController_1.deleteCollection);
exports.default = router;
//# sourceMappingURL=adminCollectionRoutes.js.map