"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditLogs = void 0;
const AuditLog_1 = __importDefault(require("../../models/AuditLog"));
const apiResponse_1 = require("../../utils/apiResponse");
const getAuditLogs = async (req, res, next) => {
    try {
        const logs = await AuditLog_1.default.find()
            .populate('admin', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .limit(500); // Limit to recent 500 for performance
        res.status(200).json(new apiResponse_1.ApiResponse('Audit logs fetched', logs));
    }
    catch (error) {
        next(error);
    }
};
exports.getAuditLogs = getAuditLogs;
//# sourceMappingURL=adminAuditLogController.js.map