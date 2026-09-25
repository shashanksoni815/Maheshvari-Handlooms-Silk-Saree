"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const collectionController_1 = require("../controllers/collectionController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
// Public routes
router.get('/', collectionController_1.getCollections);
router.get('/slug/:slug', collectionController_1.getCollectionBySlug);
router.get('/:id', collectionController_1.getCollectionById);
// Admin routes
router.use(auth_1.protect);
router.use((0, auth_1.authorize)('admin'));
router.post('/', collectionController_1.createCollection);
router.put('/:id', collectionController_1.updateCollection);
router.delete('/:id', collectionController_1.deleteCollection);
exports.default = router;
//# sourceMappingURL=collectionRoutes.js.map