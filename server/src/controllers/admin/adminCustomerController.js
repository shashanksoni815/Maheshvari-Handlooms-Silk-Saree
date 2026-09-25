"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCustomerStatus = exports.getCustomerById = exports.getCustomers = void 0;
const User_1 = __importDefault(require("../../models/User"));
const Order_1 = __importDefault(require("../../models/Order"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const getCustomers = async (req, res, next) => {
    try {
        // Only return users with role USER
        const customers = await User_1.default.find({ role: 'USER' })
            .select('-password')
            .sort({ createdAt: -1 });
        res.status(200).json(new apiResponse_1.ApiResponse('Customers fetched', customers));
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res, next) => {
    try {
        const customer = await User_1.default.findById(req.params.id).select('-password');
        if (!customer) {
            return next(new apiError_1.ApiError(404, 'Customer not found'));
        }
        // Also fetch their recent orders
        const orders = await Order_1.default.find({ user: customer._id }).sort({ createdAt: -1 }).limit(10);
        // Total spent
        const allOrders = await Order_1.default.find({ user: customer._id, 'paymentInfo.status': 'COMPLETED' });
        const totalSpent = allOrders.reduce((acc, curr) => acc + (curr.pricing?.total || 0), 0);
        res.status(200).json(new apiResponse_1.ApiResponse('Customer fetched', { customer, orders, stats: { totalSpent, orderCount: allOrders.length } }));
    }
    catch (error) {
        next(error);
    }
};
exports.getCustomerById = getCustomerById;
const updateCustomerStatus = async (req, res, next) => {
    try {
        const { isActive } = req.body;
        const customer = await User_1.default.findByIdAndUpdate(req.params.id, { isActive }, { new: true }).select('-password');
        if (!customer) {
            return next(new apiError_1.ApiError(404, 'Customer not found'));
        }
        res.status(200).json(new apiResponse_1.ApiResponse('Customer status updated', customer));
    }
    catch (error) {
        next(error);
    }
};
exports.updateCustomerStatus = updateCustomerStatus;
//# sourceMappingURL=adminCustomerController.js.map