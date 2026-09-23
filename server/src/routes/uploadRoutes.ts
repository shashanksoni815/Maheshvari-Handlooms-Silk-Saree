import { Router } from 'express';
import { uploadImages } from '../controllers/uploadController';
import upload from '../middleware/upload';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/', protect, authorize('ADMIN', 'SUPER_ADMIN'), upload.array('images', 5), uploadImages);

export default router;
