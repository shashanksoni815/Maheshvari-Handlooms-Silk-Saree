"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.createAddress = exports.getMyAddresses = void 0;
const Address_1 = __importDefault(require("../models/Address"));
// @desc    Get all addresses for logged in user
// @route   GET /api/v1/addresses
// @access  Private
const getMyAddresses = async (req, res) => {
    try {
        const addresses = await Address_1.default.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
        res.status(200).json({ success: true, data: addresses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getMyAddresses = getMyAddresses;
// @desc    Create new address
// @route   POST /api/v1/addresses
// @access  Private
const createAddress = async (req, res) => {
    try {
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;
        // If this is set to default, unset any other default addresses for this user
        if (isDefault) {
            await Address_1.default.updateMany({ user: req.user._id }, { isDefault: false });
        }
        const address = await Address_1.default.create({
            user: req.user._id,
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            isDefault: isDefault || false
        });
        res.status(201).json({ success: true, data: address });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.createAddress = createAddress;
// @desc    Update address
// @route   PUT /api/v1/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
    try {
        let address = await Address_1.default.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        // Make sure user owns address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to update this address' });
        }
        if (req.body.isDefault) {
            await Address_1.default.updateMany({ user: req.user._id }, { isDefault: false });
        }
        address = await Address_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: address });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateAddress = updateAddress;
// @desc    Delete address
// @route   DELETE /api/v1/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const address = await Address_1.default.findById(req.params.id);
        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }
        // Make sure user owns address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this address' });
        }
        await address.deleteOne();
        res.status(200).json({ success: true, data: {} });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.deleteAddress = deleteAddress;
//# sourceMappingURL=addressController.js.map