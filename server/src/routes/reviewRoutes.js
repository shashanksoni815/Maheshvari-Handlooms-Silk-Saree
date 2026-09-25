"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router({ mergeParams: true });
// Public routes
router.get('/', reviewController_1.getProductReviews);
// Protected routes
router.post('/', auth_1.protect, reviewController_1.createProductReview);
// Admin routes
router.delete('/:reviewId', auth_1.protect, (0, auth_1.authorize)('admin'), reviewController_1.deleteReview);
router.put('/:reviewId/status', auth_1.protect, (0, auth_1.authorize)('admin'), reviewController_1.updateReviewStatus);
exports.default = router;
//# sourceMappingURL=reviewRoutes.js.map