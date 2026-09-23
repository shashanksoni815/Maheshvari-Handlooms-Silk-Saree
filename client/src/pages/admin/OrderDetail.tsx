import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Package, Truck, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import { useConfirmation } from '../../components/admin/ConfirmationModal';

export const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const { confirm } = useConfirmation();

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/admin/orders/${id}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error('Failed to fetch order', error);
      navigate('/admin/orders');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    confirm({
      title: 'Update Order Status',
      message: `Are you sure you want to change the status of this order to ${newStatus}?`,
      onConfirm: async () => {
        setIsUpdating(true);
        try {
          await api.put(`/admin/orders/${id}/status`, { status: newStatus });
          await fetchOrder();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to update status');
        } finally {
          setIsUpdating(false);
        }
      }
    });
  };

  const handleRefund = async () => {
    const reason = prompt('Please enter a reason for the refund:');
    if (!reason) return;

    confirm({
      title: 'Issue Refund',
      message: `Are you sure you want to refund ₹${order.pricing?.total}? This action is irreversible.`,
      isDestructive: true,
      onConfirm: async () => {
        setIsUpdating(true);
        try {
          await api.post(`/admin/orders/${id}/refund`, { amount: order.pricing?.total, reason });
          await fetchOrder();
        } catch (error: any) {
          alert(error.response?.data?.message || 'Failed to issue refund');
        } finally {
          setIsUpdating(false);
        }
      }
    });
  };

  if (isLoading) return <div className="p-8 text-center"><Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" /></div>;
  if (!order) return null;

  const orderNumber = order.orderNumber || order._id.substring(order._id.length - 6).toUpperCase();
  const status = order.status || (order.isDelivered ? 'DELIVERED' : 'PENDING');
  const payStatus = order.paymentInfo?.status || (order.isRefunded ? 'REFUNDED' : order.isPaid ? 'COMPLETED' : 'PENDING');

  const statusSteps = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  const currentStepIndex = statusSteps.indexOf(status);

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fade-in-up">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/orders')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-primary" />
          </button>
          <div>
            <h2 className="text-2xl font-serif text-primary">Order #{orderNumber}</h2>
            <p className="text-sm text-muted mt-1">{new Date(order.createdAt).toLocaleString('en-IN')}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <select 
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={isUpdating || status === 'CANCELLED'}
            className="px-4 py-2 border border-supporting rounded-sm text-sm font-semibold focus:ring-1 focus:ring-accent disabled:opacity-50"
          >
            {statusSteps.map(s => <option key={s} value={s}>{s}</option>)}
            <option value="CANCELLED">CANCELLED</option>
          </select>
          {payStatus === 'COMPLETED' && !order.isRefunded && (
            <button 
              onClick={handleRefund}
              disabled={isUpdating}
              className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-sm text-sm font-semibold transition-colors disabled:opacity-50"
            >
              Issue Refund
            </button>
          )}
        </div>
      </div>

      {status !== 'CANCELLED' && (
        <div className="bg-white p-6 rounded-md shadow-sm border border-supporting/50">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-100 -z-10 -translate-y-1/2"></div>
            <div className="absolute left-0 top-1/2 h-1 bg-primary -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${(Math.max(0, currentStepIndex) / (statusSteps.length - 1)) * 100}%` }}></div>
            
            {statusSteps.map((step, index) => {
              const isCompleted = currentStepIndex >= index;
              return (
                <div key={step} className="flex flex-col items-center bg-white px-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <span className={`text-xs mt-2 font-bold uppercase ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>{step.replace(/_/g, ' ')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {status === 'CANCELLED' && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-md flex items-center text-red-700">
          <XCircle className="w-5 h-5 mr-2" />
          This order has been cancelled.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-md shadow-sm border border-supporting/50 overflow-hidden">
            <div className="p-4 border-b border-supporting/50 bg-gray-50/50">
              <h3 className="font-serif font-bold text-primary flex items-center gap-2">
                <Package className="w-5 h-5 text-muted" /> Order Items
              </h3>
            </div>
            <div className="divide-y divide-supporting/50">
              {(order.items || order.orderItems || []).map((item: any, idx: number) => (
                <div key={idx} className="p-4 flex items-center gap-4">
                  <img src={item.image || item.product?.images?.[0]} alt={item.name} className="w-16 h-16 object-cover rounded-sm border border-supporting" />
                  <div className="flex-1">
                    <h4 className="font-medium text-primary text-sm">{item.name}</h4>
                    <p className="text-xs text-muted">SKU: {item.product?.sku || 'N/A'}</p>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-sm">₹{item.price?.toLocaleString()}</div>
                    <div className="text-xs text-muted">Qty: {item.quantity || item.qty}</div>
                  </div>
                  <div className="font-bold text-primary text-sm w-24 text-right">
                    ₹{((item.price) * (item.quantity || item.qty)).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50/50 border-t border-supporting/50 text-sm">
              <div className="flex justify-between py-1">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium">₹{order.pricing?.subtotal?.toLocaleString() || order.itemsPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Shipping</span>
                <span className="font-medium">₹{order.pricing?.shipping?.toLocaleString() || order.shippingPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-muted">Tax</span>
                <span className="font-medium">₹{order.pricing?.tax?.toLocaleString() || order.taxPrice?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-2 mt-2 border-t border-gray-200">
                <span className="font-bold text-primary text-base">Total</span>
                <span className="font-bold text-primary text-base">₹{order.pricing?.total?.toLocaleString() || order.total?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Customer & Shipping */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-md shadow-sm border border-supporting/50 overflow-hidden">
            <div className="p-4 border-b border-supporting/50 bg-gray-50/50">
              <h3 className="font-serif font-bold text-primary flex items-center gap-2">
                <Truck className="w-5 h-5 text-muted" /> Customer & Shipping
              </h3>
            </div>
            <div className="p-4 space-y-4 text-sm">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Customer</p>
                <p className="font-medium text-primary">{order.user?.firstName} {order.user?.lastName}</p>
                <p className="text-gray-600">{order.user?.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Shipping Address</p>
                <p className="font-medium text-primary">{order.shippingAddress?.fullName}</p>
                <p className="text-gray-600">{order.shippingAddress?.addressLine1}</p>
                {order.shippingAddress?.addressLine2 && <p className="text-gray-600">{order.shippingAddress?.addressLine2}</p>}
                <p className="text-gray-600">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.pincode}</p>
                <p className="text-gray-600 mt-1">Phone: {order.shippingAddress?.phone}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-sm border border-supporting/50 overflow-hidden">
            <div className="p-4 border-b border-supporting/50 bg-gray-50/50">
              <h3 className="font-serif font-bold text-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-muted" /> Payment Information
              </h3>
            </div>
            <div className="p-4 space-y-4 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Status</span>
                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${payStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : payStatus === 'REFUNDED' ? 'bg-orange-100 text-orange-800' : 'bg-red-100 text-red-800'}`}>
                  {payStatus}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Method</span>
                <span className="font-medium">{order.paymentInfo?.method || 'N/A'}</span>
              </div>
              {order.paymentInfo?.razorpayPaymentId && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Transaction ID</span>
                  <span className="font-mono text-xs">{order.paymentInfo.razorpayPaymentId}</span>
                </div>
              )}
              {order.isRefunded && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-red-600">
                  <p className="font-semibold mb-1">Refund Details</p>
                  <p>Amount: ₹{order.refundDetails?.amount}</p>
                  <p>Reason: {order.refundDetails?.reason}</p>
                  <p className="text-xs text-gray-500 mt-1">On {new Date(order.refundDetails?.refundedAt).toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
          
        </div>

      </div>
    </div>
  );
};
