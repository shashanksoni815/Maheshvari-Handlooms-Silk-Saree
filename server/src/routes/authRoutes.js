"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post('/register', authController_1.register);
router.post('/login', authController_1.login);
router.post('/logout', authController_1.logout);
router.post('/refresh', authController_1.refresh);
router.post('/forgotpassword', authController_1.forgotPassword);
router.put('/resetpassword/:resettoken', authController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map