import multer from 'multer';
import path from 'path';

// Use memory storage for Cloudinary upload stream
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const filetypes = /jpeg|jpg|png|webp|avif/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb(new Error('Only images (jpeg, jpg, png, webp, avif) are allowed'));
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter,
});

export default upload;
