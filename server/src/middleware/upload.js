"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Use memory storage for Cloudinary upload stream
const storage = multer_1.default.memoryStorage();
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|avif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
        return cb(null, true);
    }
    cb(new Error('Only images (jpeg, jpg, png, webp, avif) are allowed'));
};
const upload = (0, multer_1.default)({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
    },
    fileFilter,
});
exports.default = upload;
//# sourceMappingURL=upload.js.map