// // // lib / api.ts

// import axios from 'axios';

// export type LoginRequest = {

//   phone: string;
//   password: string;
// };

// export type RegisterRequest = {
//   firstName: string;
//   phone: string;
//   password: string;
// };

// export type User = {
//   id: string;
//   phone: string;
//   firstName?: string;
//   createdAt: Date;
//   updatedAt: Date;
// };


// const nextApi = axios.create({
//   baseURL: '/api', 
//   withCredentials: true,
// });

// export const register = async (data: RegisterRequest): Promise<User> => {
//     const res = await nextApi.post<User>('/auth/register', data);
//     return res.data;
// };

// export const login = async (data: LoginRequest): Promise<User> => {
//   const res = await nextApi.post<User>('/auth/login', data);
//   return res.data;
// };







// // ДОБАВЛЯЕМ ФУНКЦИИ ДЛЯ ЗАКАЗОВ
// export interface OrderItem {
//   productId: string;
//   quantity: number;
//   price: number;
// }

// export interface CreateOrderRequest {
//   firstName: string;
//   lastName: string;
//   phone: string;
//   city: string;
//   novaPoshtaBranch: string;
//   comment?: string;
//   items: OrderItem[];
// }

// export interface OrderResponse {
//   _id: string;
//   orderNumber: string;
//   status: string;
//   totalAmount: number;
//   createdAt: string;
// }

// export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
//   try {
//     const res = await nextApi.post<OrderResponse>('/orders', orderData);
//     return res.data;
//   } catch (error: unknown) {
//     if (error && typeof error === 'object' && 'response' in error) {
//       const apiError = error as { response?: { data?: { error?: string } } };
//       throw new Error(apiError.response?.data?.error || 'Помилка створення замовлення');
//     }
//     throw new Error('Помилка створення замовлення');
//   }
// };



// import axios from 'axios';

import axios from 'axios';

export type LoginRequest = {

  phone: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  phone: string;
  password: string;
};

export type User = {
  id: string;
  phone: string;
  firstName?: string;
  createdAt: Date;
  updatedAt: Date;
};


const nextApi = axios.create({
  baseURL: '/api', 
  withCredentials: true,
});

export const register = async (data: RegisterRequest): Promise<User> => {
    const res = await nextApi.post<User>('/auth/register', data);
    return res.data;
};

export const login = async (data: LoginRequest): Promise<User> => {
  const res = await nextApi.post<User>('/auth/login', data);
  return res.data;
};

// ФУНКЦИЯ ДЛЯ ПОЛУЧЕНИЯ ДАННЫХ ПОЛЬЗОВАТЕЛЯ (через Next.js API)
export const getCurrentUser = async () => {
  const res = await nextApi.get('/users/me');
  return res.data;
};

// ФУНКЦИИ ДЛЯ ЗАКАЗОВ
export interface OrderItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface DeliveryDetails {
  fullName: string;
  phone: string;
  address: string;
}

export interface CreateOrderRequest {
  userId: string | null;
  items: OrderItem[];
  totalAmount: number;
  deliveryDetails: DeliveryDetails;
  comment?: string;
}

export interface OrderResponse {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  const res = await nextApi.post<OrderResponse>('/orders', orderData);
  return res.data;
};