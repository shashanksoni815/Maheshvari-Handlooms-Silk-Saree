import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { resettoken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      await api.put(`/auth/resetpassword/${resettoken}`, { password });
      setMessage('Password reset successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid or expired token. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#FAF9F6] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl border border-supporting/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div>
          <h2 className="mt-2 text-center text-3xl font-serif text-primary">Reset Password</h2>
          <p className="mt-4 text-center text-sm text-secondary">
            Enter your new password below.
          </p>
        </div>
        
        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
            {message}
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-xs uppercase tracking-widest text-muted font-bold mb-2">
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-supporting/60 placeholder-secondary text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm rounded-sm transition-colors"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-widest text-muted font-bold mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-supporting/60 placeholder-secondary text-primary focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent sm:text-sm rounded-sm transition-colors"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !!message}
              className={`group relative w-full flex justify-center py-4 px-4 border border-transparent text-xs uppercase font-bold tracking-widest rounded-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent transition-all shadow-[0_4px_14px_0_rgba(0,0,0,0.05)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] ${(isLoading || message) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-6">
          <Link to="/login" className="text-xs uppercase tracking-widest text-accent font-bold hover:text-primary transition-colors">
            &larr; Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
