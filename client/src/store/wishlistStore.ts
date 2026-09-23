import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface WishlistItem {
  product: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  stock?: number;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  toggleItem: (item: WishlistItem) => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) => {
        set((state) => {
          if (state.items.find((i) => i.product === item.product)) return state;
          return { items: [...state.items, item] };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((i) => i.product !== productId),
        }));
      },

      isWishlisted: (productId) => {
        return get().items.some((i) => i.product === productId);
      },

      toggleItem: (item) => {
        const isAlready = get().isWishlisted(item.product);
        if (isAlready) {
          get().removeItem(item.product);
        } else {
          get().addItem(item);
        }
      },
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
