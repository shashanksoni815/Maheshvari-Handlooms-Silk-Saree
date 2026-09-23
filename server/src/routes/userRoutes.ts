import express from 'express';
import { getUsers } from '../controllers/userController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.route('/').get(protect, authorize('ADMIN', 'SUPER_ADMIN'), getUsers);

export default router;
