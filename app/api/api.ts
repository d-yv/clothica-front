// app/api/api.ts

import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

 
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

export const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
});


