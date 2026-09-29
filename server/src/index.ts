import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db';
import { errorHandler } from './middleware/error';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import categoryRoutes from './routes/categoryRoutes';
import uploadRoutes from './routes/uploadRoutes';
import orderRoutes from './routes/orderRoutes';
import paymentRoutes from './routes/paymentRoutes';
import addressRoutes from './routes/addressRoutes';
import blogRoutes from './routes/blogRoutes';
import userRoutes from './routes/userRoutes';
import couponRoutes from './routes/couponRoutes';
import collectionRoutes from './routes/collectionRoutes';
import reviewRoutes from './routes/reviewRoutes';
import bannerRoutes from './routes/bannerRoutes';
import adminRoutes from './routes/adminRoutes';
import { ApiError } from './utils/apiError';

dotenv.config();
dotenv.config({ path: '.env.local', override: true });

let databaseConnection: Promise<void> | undefined;
const ensureDatabaseConnected = () => {
  if (!databaseConnection) {
    databaseConnection = connectDB().catch((error) => {
      databaseConnection = undefined;
      throw error;
    });
  }
  return databaseConnection;
};

import cookieParser from 'cookie-parser';

const app: Application = express();

// Middleware
app.use(express.json({
  verify: (req: Request & { rawBody?: Buffer }, _res, buffer) => {
    req.rawBody = Buffer.from(buffer);
  },
}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration uses exact origins; CORS_ORIGINS supports multiple deployed clients.
const normalizeOrigin = (value?: string) => {
  if (!value) return '';
  try {
    return new URL(value.trim()).origin;
  } catch {
    return '';
  }
};

const allowedOrigins = new Set([
  'http://localhost:5173',
  'http://localhost:3000',
  'https://maheshwari-frontend.vercel.app',
  'https://maheshwari-frontend-orcin.vercel.app',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
  ...(process.env.CORS_ORIGINS || '').split(','),
].map(normalizeOrigin).filter(Boolean));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.has(normalizeOrigin(origin))) {
        return callback(null, true);
      }
      callback(new ApiError(403, `CORS policy: origin ${origin} not allowed`));
    },
    credentials: true,
  })
);

// Security HTTP headers
app.use(helmet());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(async (_req: Request, _res: Response, next: express.NextFunction) => {
  try {
    await ensureDatabaseConnected();
    next();
  } catch (error) {
    next(error);
  }
});

// Routes
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'API is running' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/products/:productId/reviews', reviewRoutes); // Mount reviewRoutes under products
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/collections', collectionRoutes); // Mount collectionRoutes
app.use('/api/v1/uploads', uploadRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/blogs', blogRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/banners', bannerRoutes);
app.use('/api/v1/admin', adminRoutes);

// Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== 'production') {
  ensureDatabaseConnected()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
      });
    })
    .catch(() => {
      process.exitCode = 1;
    });
}

export default app;
