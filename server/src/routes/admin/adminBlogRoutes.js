"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const audit_1 = require("../../middleware/audit");
const blogController_1 = require("../../controllers/blogController");
const router = (0, express_1.Router)();
router.post('/', (0, auth_1.authorizePermission)('blog.create'), (0, audit_1.auditLog)('CREATE', 'BLOG'), blogController_1.createBlog);
router.put('/:id', (0, auth_1.authorizePermission)('blog.update'), (0, audit_1.auditLog)('UPDATE', 'BLOG'), blogController_1.updateBlog);
router.delete('/:id', (0, auth_1.authorizePermission)('blog.delete'), (0, audit_1.auditLog)('DELETE', 'BLOG'), blogController_1.deleteBlog);
exports.default = router;
//# sourceMappingURL=adminBlogRoutes.js.map