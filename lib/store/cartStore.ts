// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// // ВРЕМЕННЫЙ ИНТЕРФЕЙС - будет заменен когда появится настоящий cart store
// export interface CartItem {
//   id: string;           // TODO: Заменить на реальную структуру товара
//   name: string;         // из базы данных
//   price: number;
//   quantity: number;
//   size: string;
//   image?: string;
//   rating: number;
//   reviews: number;
// }

// // ВРЕМЕННЫЙ STORE - будет заменен когда появится настоящий cart store
// interface CartStore {
//   items: CartItem[];
//   addItem: (item: Omit<CartItem, 'quantity'>) => void;
//   removeItem: (id: string) => void;
//   updateQuantity: (id: string, quantity: number) => void;
//   clearCart: () => void;
//   getTotalPrice: () => number;
//   getTotalItems: () => number;
// }

// export const useCartStore = create<CartStore>()(
//   persist(
//     (set, get) => ({
//       // ВРЕМЕННЫЕ ДАННЫЕ - будут заменены на реальные из корзины
//       items: [
//         {
//           id: '1',
//           name: 'Класичне худі Clothica',
//           price: 1499,
//           quantity: 2,
//           size: 'WS 2',
//           rating: 4.5,
//           reviews: 24
//         },
//         {
//           id: '2', 
//           name: 'Базова футболка Clothica',
//           price: 1499,
//           quantity: 1,
//           size: 'WS 2',
//           rating: 4.2,
//           reviews: 18
//         }
//       ],
      
//       // ВРЕМЕННЫЕ МЕТОДЫ - будут заменены на реальные
//       addItem: (item) => {
//         set((state) => {
//           const existingItem = state.items.find((i) => i.id === item.id);
//           if (existingItem) {
//             return {
//               items: state.items.map((i) =>
//                 i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//               ),
//             };
//           }
//           return { items: [...state.items, { ...item, quantity: 1 }] };
//         });
//       },
      
//       removeItem: (id) => {
//         set((state) => ({
//           items: state.items.filter((item) => item.id !== id),
//         }));
//       },
      
//       updateQuantity: (id, quantity) => {
//         if (quantity <= 0) {
//           get().removeItem(id);
//           return;
//         }
        
//         set((state) => ({
//           items: state.items.map((item) =>
//             item.id === id ? { ...item, quantity } : item
//           ),
//         }));
//       },
      
//       clearCart: () => {
//         set({ items: [] });
//       },
      
//       getTotalPrice: () => {
//         return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
//       },

//       getTotalItems: () => {
//         return get().items.reduce((total, item) => total + item.quantity, 0);
//       },
//     }),
//     {
//       name: 'cart-storage', // TODO: Проверить ключ когда появится настоящий store
//     }
//   )
// );









// import { Size } from '@/types/good';
// import { create } from 'zustand';
// import { persist } from 'zustand/middleware';

// export type CartItem = {
//   goodId: string;
//   name: string;
//   rate: number;
//   reviewsNumber: number;
//   price: number;
//   amount: number;
//   size: Size;
//   image?: string;
// };

// interface ShopStore {
//   cartItems: CartItem[];
//   addToCart: (item: CartItem) => void;
//   removeFromCart: (goodId: string, size: Size) => void;
//   updateAmount: (goodId: string, size: Size, amount: number) => void;
//   clearCart: () => void;
// }

// export const useShopStore = create<ShopStore>()(persist(set => ({
//   cartItems: [],
//   addToCart: item => set(state => {
//   const existingItem = state.cartItems.find(
//     cartItem => cartItem.goodId === item.goodId && cartItem.size === item.size
//   );

//   if (existingItem) {
//     return {
//       cartItems: state.cartItems.map(cartItem =>
//         cartItem.goodId === item.goodId && cartItem.size === item.size
//           ? { ...cartItem, amount: cartItem.amount + item.amount }
//           : cartItem
//       )
//     };
//   }

//     return { cartItems: [...state.cartItems, item] };
//   }),
//   removeFromCart: (goodId, size) =>
//     set(state => ({
//       cartItems: state.cartItems.filter(i => !(i.goodId === goodId && i.size === size)),
//     })),
//   updateAmount: (goodId, size, amount) =>
//     set(state => ({
//       cartItems: state.cartItems.map(i => 
//         i.goodId === goodId && i.size === size ? { ...i, amount } : i
//       ),
//     })),
//   clearCart: () => set({ cartItems: [] }), }),
//   {
//     name: 'shop-cart',
//     partialize: state => ({ cartItems: state.cartItems }),
//   }
// ),);





import { Size } from '@/types/good';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type CartItem = {
  goodId: string;
  name: string;
  rate: number;
  reviewsNumber: number;
  price: number;
  amount: number;
  size: Size;
  image?: string;
};

interface ShopStore {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (goodId: string, size: Size) => void;
  updateAmount: (goodId: string, size: Size, amount: number) => void;
  clearCart: () => void;
}

export const useShopStore = create<ShopStore>()(persist(set => ({
  // ВРЕМЕННЫЕ ДАННЫЕ ДЛЯ ТЕСТИРОВАНИЯ
  cartItems: [
    {
      goodId: '1',
      name: 'Класичне худі Clothica',
      rate: 4.5,
      reviewsNumber: 24,
      price: 1499,
      amount: 2,
      size: 'M' as Size,
    },
    {
      goodId: '2', 
      name: 'Базова футболка Clothica',
      rate: 4.2,
      reviewsNumber: 18,
      price: 1499,
      amount: 1,
      size: 'L' as Size,
    }
  ],
  addToCart: item => set(state => {
    const existingItem = state.cartItems.find(
      cartItem => cartItem.goodId === item.goodId && cartItem.size === item.size
    );

    if (existingItem) {
      return {
        cartItems: state.cartItems.map(cartItem =>
          cartItem.goodId === item.goodId && cartItem.size === item.size
            ? { ...cartItem, amount: cartItem.amount + item.amount }
            : cartItem
        )
      };
    }

    return { cartItems: [...state.cartItems, item] };
  }),
  removeFromCart: (goodId, size) =>
    set(state => ({
      cartItems: state.cartItems.filter(i => !(i.goodId === goodId && i.size === size)),
    })),
  updateAmount: (goodId, size, amount) =>
    set(state => ({
      cartItems: state.cartItems.map(i => 
        i.goodId === goodId && i.size === size ? { ...i, amount } : i
      ),
    })),
  clearCart: () => set({ cartItems: [] }), }),
  {
    name: 'shop-cart',
    partialize: state => ({ cartItems: state.cartItems }),
  }
),);