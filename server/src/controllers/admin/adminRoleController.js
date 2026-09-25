"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.createRole = exports.getRoles = void 0;
const Role_1 = __importDefault(require("../../models/Role"));
const apiError_1 = require("../../utils/apiError");
const apiResponse_1 = require("../../utils/apiResponse");
const getRoles = async (req, res, next) => {
    try {
        const roles = await Role_1.default.find();
        res.status(200).json(new apiResponse_1.ApiResponse('Roles fetched', roles));
    }
    catch (error) {
        next(error);
    }
};
exports.getRoles = getRoles;
const createRole = async (req, res, next) => {
    try {
        const role = await Role_1.default.create(req.body);
        res.status(201).json(new apiResponse_1.ApiResponse('Role created successfully', role));
    }
    catch (error) {
        next(error);
    }
};
exports.createRole = createRole;
const updateRole = async (req, res, next) => {
    try {
        const role = await Role_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!role)
            return next(new apiError_1.ApiError(404, 'Role not found'));
        res.status(200).json(new apiResponse_1.ApiResponse('Role updated', role));
    }
    catch (error) {
        next(error);
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res, next) => {
    try {
        const role = await Role_1.default.findByIdAndDelete(req.params.id);
        if (!role)
            return next(new apiError_1.ApiError(404, 'Role not found'));
        res.status(200).json(new apiResponse_1.ApiResponse('Role deleted', {}));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteRole = deleteRole;
//# sourceMappingURL=adminRoleController.js.map