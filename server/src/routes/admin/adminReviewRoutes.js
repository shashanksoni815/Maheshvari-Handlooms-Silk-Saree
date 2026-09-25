"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../../middleware/auth");
const adminReviewController_1 = require("../../controllers/admin/adminReviewController");
const router = (0, express_1.Router)();
router.get('/', (0, auth_1.authorizePermission)('reviews.read'), adminReviewController_1.getReviews);
router.put('/:id/status', (0, auth_1.authorizePermission)('reviews.update'), adminReviewController_1.updateReviewStatus);
router.delete('/:id', (0, auth_1.authorizePermission)('reviews.delete'), adminReviewController_1.deleteReview);
exports.default = router;
//# sourceMappingURL=adminReviewRoutes.js.map