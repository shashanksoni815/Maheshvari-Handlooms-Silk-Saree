"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const mongoose_1 = __importDefault(require("mongoose"));
const Collection_1 = __importDefault(require("./models/Collection"));
mongoose_1.default.connect('mongodb://127.0.0.1:27017/maheshwari_silk').then(async () => {
    await Collection_1.default.create({ name: 'Festive Collection', slug: 'festive', description: 'For the festive season' }).catch(() => { });
    console.log('Done seeding festive');
    process.exit(0);
});
//# sourceMappingURL=seed_festive.js.map