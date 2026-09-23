import express from 'express';
import { getMyAddresses, createAddress, updateAddress, deleteAddress } from '../controllers/addressController';
import { protect } from '../middleware/auth';

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getMyAddresses)
  .post(createAddress);

router.route('/:id')
  .put(updateAddress)
  .delete(deleteAddress);

export default router;
