import { Router } from 'express';
import { uploadImage, uploadImages } from '../controllers/uploadController';
import upload from '../middleware/upload';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.use(protect, authorize('ADMIN', 'SUPER_ADMIN'));

router.post('/', upload.single('image'), uploadImage);
router.post('/multiple', upload.array('images', 5), uploadImages);

export default router;
