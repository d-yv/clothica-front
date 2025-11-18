
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Good } from "@/types/good";

export type CartItem = Good & { quantity: number };

type CartState = {
  items: CartItem[];
  add: (good: Good) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: () => number;


  _hasHydrated: boolean;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      _hasHydrated: false,

      add: (good) =>
        set((state) => {
          const ex = state.items.find((i) => i._id === good._id);
          if (ex) {
            return {
              items: state.items.map((i) =>
                i._id === good._id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...good, quantity: 1 }] };
        }),

      decrement: (id) =>
        set((state) => {
          const found = state.items.find((i) => i._id === id);
          if (!found) return state;
          if (found.quantity > 1) {
            return {
              items: state.items.map((i) =>
                i._id === id ? { ...i, quantity: i.quantity - 1 } : i
              ),
            };
          }
          return { items: state.items.filter((i) => i._id !== id) };
        }),

      remove: (id) => set((s) => ({ items: s.items.filter((i) => i._id !== id) })),
      clear: () => set({ items: [] }),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.price.value * i.quantity, 0),
    }),
    {
      name: "cart", // ключ у localStorage
      storage: createJSONStorage(() => localStorage),
      // коли дані з localStorage зчитані — позначаємо гідратацію
      onRehydrateStorage: () => (state) => {
        state && (state._hasHydrated = true);
      },
      // зберігаємо тільки items (не обов’язково, але охайно)
      partialize: (state) => ({ items: state.items, _hasHydrated: state._hasHydrated }),
    }
  )
);
