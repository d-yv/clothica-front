// lib / api.ts

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