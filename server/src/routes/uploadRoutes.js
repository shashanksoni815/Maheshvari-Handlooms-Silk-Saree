"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const uploadController_1 = require("../controllers/uploadController");
const upload_1 = __importDefault(require("../middleware/upload"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
router.use(auth_1.protect, (0, auth_1.authorize)('ADMIN', 'SUPER_ADMIN'));
router.post('/', upload_1.default.single('image'), uploadController_1.uploadImage);
router.post('/multiple', upload_1.default.array('images', 5), uploadController_1.uploadImages);
exports.default = router;
//# sourceMappingURL=uploadRoutes.js.map