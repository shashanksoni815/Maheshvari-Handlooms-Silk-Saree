import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product: string; // Product ID
  name: string;
  price: number;
  mrp?: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  couponCode: string | null;
  couponDiscount: number; // Percentage or flat
  
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDiscountTotal: () => number;
  getTaxTotal: () => number;
  getShippingTotal: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      couponCode: null,
      couponDiscount: 0,

      addItem: (item) => {
        set((state) => {
          const existingItem = state.items.find((i) => i.product === item.product);
          if (existingItem) {
            const newQuantity = Math.min(existingItem.quantity + item.quantity, item.stock);
            return {
              items: state.items.map((i) =>
                i.product === item.product ? { ...i, quantity: newQuantity } : i
              ),
              isDrawerOpen: true,
            };
          }
          return { items: [...state.items, item], isDrawerOpen: true };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((i) => {
            if (i.product === productId) {
              const newQuantity = Math.max(1, Math.min(quantity, i.stock));
              return { ...i, quantity: newQuantity };
            }
            return i;
          }),
        }));
      },

      clearCart: () => set({ items: [], couponCode: null, couponDiscount: 0 }),
      
      applyCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      removeCoupon: () => set({ couponCode: null, couponDiscount: 0 }),

      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getDiscountTotal: () => {
        const subtotal = get().getSubtotal();
        return (subtotal * get().couponDiscount) / 100;
      },
      
      getTaxTotal: () => {
        // Assume 5% GST on silk sarees for example
        const afterDiscount = get().getSubtotal() - get().getDiscountTotal();
        return afterDiscount * 0.05;
      },
      
      getShippingTotal: () => {
        const afterDiscount = get().getSubtotal() - get().getDiscountTotal();
        return afterDiscount > 10000 || afterDiscount === 0 ? 0 : 250;
      },
      
      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountTotal();
        const tax = get().getTaxTotal();
        const shipping = get().getShippingTotal();
        return subtotal - discount + tax + shipping;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount 
      }),
    }
  )
);
