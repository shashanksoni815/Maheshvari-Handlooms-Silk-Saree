import { Router } from 'express';
import { authorizePermission } from '../../middleware/auth';
import { auditLog } from '../../middleware/audit';
import { createBlog, updateBlog, deleteBlog } from '../../controllers/blogController';

const router = Router();

router.post('/', authorizePermission('blog.create'), auditLog('CREATE', 'BLOG'), createBlog);
router.put('/:id', authorizePermission('blog.update'), auditLog('UPDATE', 'BLOG'), updateBlog);
router.delete('/:id', authorizePermission('blog.delete'), auditLog('DELETE', 'BLOG'), deleteBlog);

export default router;
