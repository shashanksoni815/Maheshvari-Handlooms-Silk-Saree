import express from 'express';
import {
  getCollections,
  getCollectionById,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} from '../controllers/collectionController';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', getCollections);
router.get('/slug/:slug', getCollectionBySlug);
router.get('/:id', getCollectionById);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.post('/', createCollection);
router.put('/:id', updateCollection);
router.delete('/:id', deleteCollection);

export default router;
