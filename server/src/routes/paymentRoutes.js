"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("../controllers/paymentController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Webhook route must be public (Razorpay server hits this directly)
router.post('/webhook', paymentController_1.razorpayWebhook);
// Protected routes (User hits these from the browser)
router.use(auth_1.protect);
router.post('/create-order/:orderId', paymentController_1.createRazorpayOrder);
router.post('/verify', paymentController_1.verifyPayment);
exports.default = router;
//# sourceMappingURL=paymentRoutes.js.map