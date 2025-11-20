// lib/api.ts
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

export const getCurrentUser = async () => {
  const res = await nextApi.get('/users/me');
  return res.data;
};

export interface CartItem {
  goodId: string; 
  size: string;
  amount: number;
  pricePerItem: number;
}

export interface UserData {
  firstName: string;
  lastName: string;
  phone: string;
  city: string;
  postOfficeNum: string;
  comment?: string;
}

export interface CreateOrderRequest {
  cart: CartItem[]; 
  status: string; 
  userData: UserData; 
}

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

export interface CustomerInfo {
  fullName: string;
  phone: string;
  address: string;
}

export interface OrderResponse {
  _id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

export const createOrder = async (orderData: CreateOrderRequest): Promise<OrderResponse> => {
  try {
    const res = await nextApi.post<OrderResponse>('/orders', orderData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
