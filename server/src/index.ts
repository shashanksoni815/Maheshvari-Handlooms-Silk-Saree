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

dotenv.config();

// Connect to Database
connectDB();

import cookieParser from 'cookie-parser';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration - allow frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      // Allow any vercel.app preview/production URL from the project
      if (origin.includes('vercel.app') || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
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
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
}

export default app;
