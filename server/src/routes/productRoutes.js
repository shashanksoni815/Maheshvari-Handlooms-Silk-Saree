"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const reviewController_1 = require("../controllers/reviewController");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.get('/', productController_1.getProducts);
router.get('/config/filters', productController_1.getProductFilters);
router.get('/:id', productController_1.getProductById);
router.post('/', auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), productController_1.createProduct);
router.put('/:id', auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), productController_1.updateProduct);
router.delete('/:id', auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), productController_1.deleteProduct);
// Reviews
router.post('/:id/reviews', auth_1.protect, reviewController_1.createProductReview);
exports.default = router;
//# sourceMappingURL=productRoutes.js.map