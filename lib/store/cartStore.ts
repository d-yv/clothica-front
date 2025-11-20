
// lib/store/cartStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


export interface CartItem {
  _id: string;
  goodId: string;
  name: string;
  price: number;
  image: string; 
  amount: number;
  size: string;
  rate?: number;
  reviewsNumber?: number;
}

interface CartState {
  cartItems: CartItem[];
  _hasHydrated: boolean;
  
  addToCart: (item: Omit<CartItem, 'amount'>) => void;
  removeFromCart: (id: string, size: string) => void;
  updateAmount: (id: string, size: string, amount: number) => void;
  clearCart: () => void;
  setHasHydrated: (state: boolean) => void;

  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useShopStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      _hasHydrated: false,

      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem.goodId === item.goodId && cartItem.size === item.size
          );
          
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((cartItem) =>
                cartItem.goodId === item.goodId && cartItem.size === item.size
                  ? { ...cartItem, amount: cartItem.amount + 1 }
                  : cartItem
              ),
            };
          }

          return {
            cartItems: [...state.cartItems, { ...item, amount: 1 }],
          };
        }),

      removeFromCart: (id, size) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (item) => !(item.goodId === id && item.size === size)
          ),
        })),

      updateAmount: (id, size, amount) =>
        set((state) => {
          if (amount <= 0) {
            return {
              cartItems: state.cartItems.filter(
                (item) => !(item.goodId === id && item.size === size)
              ),
            };
          }
          
          return {
            cartItems: state.cartItems.map((item) =>
              item.goodId === id && item.size === size ? { ...item, amount } : item
            ),
          };
        }),

      clearCart: () => set({ cartItems: [] }),

      setHasHydrated: (state) => set({ _hasHydrated: state }),

      getTotalPrice: () => {
        const state = get();
        return state.cartItems.reduce((total, item) => total + item.price * item.amount, 0);
      },

      getTotalItems: () => {
        const state = get();
        return state.cartItems.reduce((total, item) => total + item.amount, 0);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({ 
        cartItems: state.cartItems 
      }),
    }
  )
);
