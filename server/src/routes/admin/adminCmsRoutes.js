"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const adminCmsController_1 = require("../../controllers/admin/adminCmsController");
const router = (0, express_1.Router)();
// Store Routes
router.get('/stores', (0, auth_1.authorizePermission)('cms.read'), adminCmsController_1.getStores);
router.post('/stores', (0, auth_1.authorizePermission)('cms.update'), (0, audit_1.auditLog)('CREATE', 'STORE'), adminCmsController_1.createStore);
router.put('/stores/:id', (0, auth_1.authorizePermission)('cms.update'), (0, audit_1.auditLog)('UPDATE', 'STORE'), adminCmsController_1.updateStore);
router.delete('/stores/:id', (0, auth_1.authorizePermission)('cms.update'), (0, audit_1.auditLog)('DELETE', 'STORE'), adminCmsController_1.deleteStore);
// FAQ Routes
router.get('/faqs', (0, auth_1.authorizePermission)('cms.read'), adminCmsController_1.getFaqs);
router.post('/faqs', (0, auth_1.authorizePermission)('cms.update'), (0, audit_1.auditLog)('CREATE', 'FAQ'), adminCmsController_1.createFaq);
router.put('/faqs/:id', (0, auth_1.authorizePermission)('cms.update'), (0, audit_1.auditLog)('UPDATE', 'FAQ'), adminCmsController_1.updateFaq);
router.delete('/faqs/:id', (0, auth_1.authorizePermission)('cms.update'), (0, audit_1.auditLog)('DELETE', 'FAQ'), adminCmsController_1.deleteFaq);
// Settings Routes (for Policies like Terms, Privacy, etc.)
router.get('/settings', (0, auth_1.authorizePermission)('cms.read'), adminCmsController_1.getSettings);
router.put('/settings', (0, auth_1.authorizePermission)('cms.update'), (0, audit_1.auditLog)('UPDATE', 'SETTING'), adminCmsController_1.updateSetting);
exports.default = router;
//# sourceMappingURL=adminCmsRoutes.js.map