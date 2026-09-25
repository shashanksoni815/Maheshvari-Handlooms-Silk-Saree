"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const couponController_1 = require("../controllers/couponController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.route('/')
    .get(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), couponController_1.getCoupons)
    .post(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), couponController_1.createCoupon);
router.route('/:id')
    .put(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), couponController_1.updateCoupon)
    .delete(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), couponController_1.deleteCoupon);
exports.default = router;
//# sourceMappingURL=couponRoutes.js.map