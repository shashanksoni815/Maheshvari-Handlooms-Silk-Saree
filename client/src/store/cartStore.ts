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
  
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  toggleDrawer: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTaxTotal: () => number;
  getShippingTotal: () => number;
  getGrandTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,

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

      clearCart: () => set({ items: [] }),

      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      
      getTaxTotal: () => {
        return 0;
      },
      
      getShippingTotal: () => {
        return 0;
      },
      
      getGrandTotal: () => {
        const subtotal = get().getSubtotal();
        const tax = get().getTaxTotal();
        const shipping = get().getShippingTotal();
        return subtotal + tax + shipping;
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
      }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        items: (persistedState as Partial<CartState> | undefined)?.items || [],
      }),
    }
  )
);
