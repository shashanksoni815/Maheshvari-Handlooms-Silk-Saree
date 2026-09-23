import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthStore } from '../../store/authStore';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginForm = () => {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError('');
    try {
      const response = await api.post('/auth/login', data);
      const userData = response.data.data;
      setUser(userData);
      
      if (userData.role === 'ADMIN' || userData.role === 'SUPER_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/account');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-primary">
        <img 
          src="https://images.unsplash.com/photo-1610030469983-98e550d615ef?q=80&w=1200&auto=format&fit=crop" 
          alt="Silk details" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent"></div>
        <div className="absolute bottom-12 left-12 text-white max-w-md">
          <h2 className="text-4xl font-serif mb-4 leading-tight">Return to the world of heritage silk.</h2>
          <p className="text-white/80 font-light">Access your order history, manage your wishlist, and track your artisan-crafted pieces.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-background relative">
        <Link to="/" className="absolute top-8 left-8 flex items-center text-secondary hover:text-primary transition-colors text-sm uppercase tracking-widest font-medium">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Shop
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-serif text-primary mb-3">Welcome Back</h1>
            <p className="text-secondary">Sign in to your Maheshwari Silk account</p>
          </div>

          {error && <div className="mb-6 p-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-sm text-center">{error}</div>}
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest font-medium text-secondary mb-2">Email Address</label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 bg-transparent border border-supporting rounded-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="you@example.com"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs uppercase tracking-widest font-medium text-secondary">Password</label>
                <a href="#" className="text-xs text-accent hover:underline">Forgot password?</a>
              </div>
              <input
                {...register('password')}
                type="password"
                className="w-full px-4 py-3 bg-transparent border border-supporting rounded-sm focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 uppercase tracking-widest text-sm font-semibold hover:bg-primary/90 transition flex justify-center items-center"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-supporting text-center">
            <p className="text-secondary text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary font-medium hover:text-accent transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
