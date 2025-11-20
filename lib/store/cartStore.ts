
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Size} from '@/types/good';

export interface CartItem {
  goodId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  rate: number;
  reviewsNumber: number;
  amount: number;
  size: Size;
}

interface CartState {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  updateQuantity: (id: string, quantity: number) => void;
}

export const useShopStore = create<CartState>()(
  persist(
    (set) => ({
      cartItems: [],


        addToCart: (item) => set((state) => {
          const existing = state.cartItems.find(
                (i) => i.goodId === item.goodId && i.size === item.size
            );

            if (existing) {
            return {
            cartItems: state.cartItems.map((i) =>
            
             i.goodId === item.goodId && i.size === item.size
                    ? { ...i, quantity: i.quantity + item.quantity } 
                    : i
     ),
  };
 }
 
  return { cartItems: [...state.cartItems, item] };
  }),
      removeFromCart: (id) =>
        set((state) => ({
          cartItems: state.cartItems.filter((item) => item.goodId !== id),
        })),

      clearCart: () => set({ cartItems: [] }),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          cartItems: state.cartItems.map((item) => (item.goodId === id ? { ...item, quantity: Math.max(1, quantity) } : item)),
        })),
    }),
    {
      name: 'cart-storage',
    }
  )
);