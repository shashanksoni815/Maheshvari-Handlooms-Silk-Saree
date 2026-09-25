"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bannerController_1 = require("../controllers/bannerController");
const router = (0, express_1.Router)();
router.get('/', bannerController_1.getActiveBanners);
exports.default = router;
//# sourceMappingURL=bannerRoutes.js.map