"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const blogController_1 = require("../controllers/blogController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(blogController_1.getBlogs)
    .post(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), blogController_1.createBlog);
router.route('/:slug').get(blogController_1.getBlogBySlug);
router.route('/:id')
    .put(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), blogController_1.updateBlog)
    .delete(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), blogController_1.deleteBlog);
exports.default = router;
//# sourceMappingURL=blogRoutes.js.map