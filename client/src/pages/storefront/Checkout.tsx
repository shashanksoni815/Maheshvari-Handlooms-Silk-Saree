import React, { useState } from 'react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ShieldCheck, Lock, CreditCard } from 'lucide-react';
import api from '../../services/api';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  addressLine1: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().min(6, 'Valid pincode is required'),
});

type CheckoutFormValues = z.infer<typeof addressSchema>;

export const Checkout = () => {
  const { 
    items, 
    getSubtotal, 
    getDiscountTotal,
    getTaxTotal,
    getShippingTotal,
    getGrandTotal,
    couponCode,
    clearCart 
  } = useCartStore();
  
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscountTotal();
  const tax = getTaxTotal();
  const shipping = getShippingTotal();
  const total = getGrandTotal();

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      fullName: user ? `${user.firstName} ${user.lastName}` : '',
      email: user ? user.email : '',
    }
  });

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async (data: CheckoutFormValues) => {
    if (!isAuthenticated) {
      alert("Please login or create an account to proceed with checkout.");
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: items.map(i => ({
          product: i.product,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image
        })),
        shippingAddress: data,
        pricing: {
          subtotal,
          discount,
          tax,
          shipping,
          total
        },
        couponCode,
        paymentMethod: 'RAZORPAY'
      };

      const orderRes = await api.post('/orders', orderData);
      const orderId = orderRes.data.data._id;

      const res = await loadRazorpay();
      if (!res) {
        alert('Razorpay SDK failed to load. Are you online?');
        setIsProcessing(false);
        return;
      }

      const rzpOrderRes = await api.post(`/payments/create-order/${orderId}`);
      const { amount, id: razorpayOrderId, currency } = rzpOrderRes.data.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_KEY_ID', 
        amount: amount.toString(),
        currency: currency,
        name: 'Maheshwari Silk',
        description: 'Premium Saree Purchase',
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            await api.post('/payments/verify', {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderId
            });
            
            clearCart();
            navigate(`/order-success/${orderId}`);
          } catch (err) {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: data.fullName,
          email: data.email,
          contact: data.phone,
        },
        theme: {
          color: '#063F32', 
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();

    } catch (error) {
      console.error(error);
      alert('Something went wrong during checkout. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center bg-background min-h-[60vh] flex flex-col justify-center items-center">
        <h1 className="text-4xl md:text-5xl font-serif text-primary mb-6">Checkout Unavailable</h1>
        <p className="text-secondary mb-10 tracking-wide text-lg">Your cart is empty.</p>
        <Link 
          to="/shop" 
          className="inline-flex items-center justify-center bg-primary text-white px-10 py-4 uppercase tracking-widest text-sm font-bold shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 bg-background min-h-screen">
      <div className="flex items-center justify-center mb-12 flex-col">
        <h1 className="text-3xl font-serif text-primary mb-4 flex items-center gap-3">
          <Lock className="w-6 h-6 text-accent" /> Secure Checkout
        </h1>
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted font-bold">
          <span className="text-primary">Cart</span>
          <span className="text-supporting">/</span>
          <span className="text-primary">Information</span>
          <span className="text-supporting">/</span>
          <span>Payment</span>
        </div>
      </div>
      
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
        
        {/* Left Column: Shipping Form */}
        <div className="flex-1">
          <div className="bg-white p-8 border border-supporting shadow-sm">
            <h2 className="text-xl font-serif text-primary mb-8 pb-4 border-b border-supporting">Shipping Information</h2>
            
            <form id="checkout-form" onSubmit={handleSubmit(handlePayment)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Full Name</label>
                  <input {...register('fullName')} className="w-full border border-supporting bg-background px-4 py-3 focus:outline-none focus:border-primary text-secondary" placeholder="Jane Doe" />
                  {errors.fullName && <p className="text-burgundy text-xs mt-2">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Email Address</label>
                  <input {...register('email')} type="email" className="w-full border border-supporting bg-background px-4 py-3 focus:outline-none focus:border-primary text-secondary" placeholder="jane@example.com" />
                  {errors.email && <p className="text-burgundy text-xs mt-2">{errors.email.message}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Phone Number</label>
                <input {...register('phone')} className="w-full border border-supporting bg-background px-4 py-3 focus:outline-none focus:border-primary text-secondary" placeholder="+91 98765 43210" />
                {errors.phone && <p className="text-burgundy text-xs mt-2">{errors.phone.message}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Address</label>
                <input {...register('addressLine1')} className="w-full border border-supporting bg-background px-4 py-3 focus:outline-none focus:border-primary text-secondary" placeholder="House/Flat No., Street, Area" />
                {errors.addressLine1 && <p className="text-burgundy text-xs mt-2">{errors.addressLine1.message}</p>}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">City</label>
                  <input {...register('city')} className="w-full border border-supporting bg-background px-4 py-3 focus:outline-none focus:border-primary text-secondary" placeholder="Mumbai" />
                  {errors.city && <p className="text-burgundy text-xs mt-2">{errors.city.message}</p>}
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">State</label>
                  <input {...register('state')} className="w-full border border-supporting bg-background px-4 py-3 focus:outline-none focus:border-primary text-secondary" placeholder="Maharashtra" />
                  {errors.state && <p className="text-burgundy text-xs mt-2">{errors.state.message}</p>}
                </div>
                <div className="col-span-1">
                  <label className="block text-xs font-bold uppercase tracking-widest text-secondary mb-2">Pincode</label>
                  <input {...register('pincode')} className="w-full border border-supporting bg-background px-4 py-3 focus:outline-none focus:border-primary text-secondary" placeholder="400001" />
                  {errors.pincode && <p className="text-burgundy text-xs mt-2">{errors.pincode.message}</p>}
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary & Payment */}
        <div className="w-full lg:w-[420px] flex-shrink-0">
          <div className="bg-white p-6 md:p-8 border border-supporting shadow-sm sticky top-24">
            <h2 className="text-xl font-serif text-primary mb-6 border-b border-supporting pb-4">Order Summary</h2>
            
            <div className="space-y-4 mb-8 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.product} className="flex gap-4 items-center">
                  <div className="w-16 h-20 bg-supporting/20 flex-shrink-0 border border-supporting">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover object-top" />
                  </div>
                  <div className="flex-1 text-sm">
                    <p className="font-serif text-primary line-clamp-1 mb-1">{item.name}</p>
                    <p className="text-muted text-xs uppercase tracking-wider mb-1">Qty: {item.quantity}</p>
                    <p className="font-semibold text-secondary">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 text-sm border-t border-supporting pt-6 mb-8 text-secondary">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              
              {discount > 0 && (
                <div className="flex justify-between text-burgundy font-medium">
                  <span>Discount {couponCode && `(${couponCode})`}</span>
                  <span>- ₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span>Tax (GST)</span>
                <span>₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>{shipping === 0 ? 'Free' : `₹${shipping.toLocaleString('en-IN')}`}</span>
              </div>
              
              <div className="flex justify-between items-center text-xl font-serif text-primary border-t border-supporting pt-6 mt-2">
                <span className="uppercase tracking-widest text-xs font-bold text-secondary">Total Amount</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={isProcessing}
              className="w-full flex justify-center items-center bg-primary text-white py-4 uppercase tracking-widest text-xs font-bold hover:bg-primary/90 hover:shadow-lg transition-all disabled:opacity-70 disabled:hover:shadow-none gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Processing
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4" /> Pay Securely
                </>
              )}
            </button>
            
            <div className="flex flex-col items-center gap-3 mt-6">
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted font-bold">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>100% Secure Payment by Razorpay</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

