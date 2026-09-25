"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../controllers/orderController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect); // All order routes require authentication
router.route('/').post(orderController_1.createOrder).get((0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), orderController_1.getOrders);
router.route('/myorders').get(orderController_1.getMyOrders);
router.route('/:id').get(orderController_1.getOrderById);
router.route('/:id/cancel').put(orderController_1.cancelOrder);
router.route('/:id/deliver').put((0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'), orderController_1.updateOrderToDelivered);
exports.default = router;
//# sourceMappingURL=orderRoutes.js.map