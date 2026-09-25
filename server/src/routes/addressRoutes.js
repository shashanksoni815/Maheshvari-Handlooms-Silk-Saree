"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const addressController_1 = require("../controllers/addressController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.route('/')
    .get(addressController_1.getMyAddresses)
    .post(addressController_1.createAddress);
router.route('/:id')
    .put(addressController_1.updateAddress)
    .delete(addressController_1.deleteAddress);
exports.default = router;
//# sourceMappingURL=addressRoutes.js.map