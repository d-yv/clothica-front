
import { create } from "zustand";
import { persist } from "zustand/middleware";


export type CartItem = {
  goodId: string;
  name: string;
  rate: number;
  reviewsNumber: number;
  price: number;
  amount: number;
  image?: string;
};


interface ShopStore {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (goodId: string) => void;
  updateAmount: (goodId: string, amount: number) => void;
  clearCart: () => void;
}


export const useShopStore = create<ShopStore>()(
  persist(
    (set) => ({
      cartItems: [],


      addToCart: (item) =>
        set((state) => {
          const exist = state.cartItems.find(
            (i) => i.goodId === item.goodId
          );


          if (exist) {
            return {
              cartItems: state.cartItems.map((i) =>
                i.goodId === item.goodId
                  ? { ...i, amount: i.amount + item.amount }
                  : i
              ),
            };
          }


          return { cartItems: [...state.cartItems, item] };
        }),


      removeFromCart: (goodId) =>
        set((state) => ({
          cartItems: state.cartItems.filter((i) => i.goodId !== goodId),
        })),


      updateAmount: (goodId, amount) =>
        set((state) => ({
          cartItems: state.cartItems.map((i) =>
            i.goodId === goodId ? { ...i, amount } : i
          ),
        })),


      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "shop-cart",
      partialize: (state) => ({ cartItems: state.cartItems }),
    }
  )
);




