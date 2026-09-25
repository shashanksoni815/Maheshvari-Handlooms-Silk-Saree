"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const error_1 = require("./middleware/error");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const uploadRoutes_1 = __importDefault(require("./routes/uploadRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const addressRoutes_1 = __importDefault(require("./routes/addressRoutes"));
const blogRoutes_1 = __importDefault(require("./routes/blogRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const couponRoutes_1 = __importDefault(require("./routes/couponRoutes"));
const collectionRoutes_1 = __importDefault(require("./routes/collectionRoutes"));
const reviewRoutes_1 = __importDefault(require("./routes/reviewRoutes"));
const bannerRoutes_1 = __importDefault(require("./routes/bannerRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
// Connect to Database
(0, db_1.default)();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
// CORS configuration - allow frontend origins
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.CLIENT_URL,
    process.env.FRONTEND_URL,
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin)
            return callback(null, true);
        // Allow any vercel.app preview/production URL from the project
        if (origin.includes('vercel.app') || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(new Error(`CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
}));
// Security HTTP headers
app.use((0, helmet_1.default)());
// Logging
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
// Routes
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', message: 'API is running' });
});
app.use('/api/v1/auth', authRoutes_1.default);
app.use('/api/v1/users', userRoutes_1.default);
app.use('/api/v1/products', productRoutes_1.default);
app.use('/api/v1/products/:productId/reviews', reviewRoutes_1.default); // Mount reviewRoutes under products
app.use('/api/v1/categories', categoryRoutes_1.default);
app.use('/api/v1/collections', collectionRoutes_1.default); // Mount collectionRoutes
app.use('/api/v1/uploads', uploadRoutes_1.default);
app.use('/api/v1/orders', orderRoutes_1.default);
app.use('/api/v1/payments', paymentRoutes_1.default);
app.use('/api/v1/addresses', addressRoutes_1.default);
app.use('/api/v1/blogs', blogRoutes_1.default);
app.use('/api/v1/coupons', couponRoutes_1.default);
app.use('/api/v1/banners', bannerRoutes_1.default);
app.use('/api/v1/admin', adminRoutes_1.default);
// Error Handling Middleware
app.use(error_1.errorHandler);
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
}
exports.default = app;
//# sourceMappingURL=index.js.map