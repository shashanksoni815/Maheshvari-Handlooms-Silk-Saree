import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Address from '../models/Address';

// @desc    Get all addresses for logged in user
// @route   GET /api/v1/addresses
// @access  Private
export const getMyAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
    res.status(200).json({ success: true, data: addresses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new address
// @route   POST /api/v1/addresses
// @access  Private
export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phone, addressLine1, addressLine2, city, state, pincode, isDefault } = req.body;
    
    // If this is set to default, unset any other default addresses for this user
    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update address
// @route   PUT /api/v1/addresses/:id
// @access  Private
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    let address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Make sure user owns address
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to update this address' });
    }

    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    address = await Address.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: address });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete address
// @route   DELETE /api/v1/addresses/:id
// @access  Private
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const address = await Address.findById(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    // Make sure user owns address
    if (address.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: 'Not authorized to delete this address' });
    }

    await address.deleteOne();

    res.status(200).json({ success: true, data: {} });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
