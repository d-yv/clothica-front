// app/api/api.ts
import axios, { AxiosError } from 'axios';
export type ApiError = AxiosError<{ error: string }>;


const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL 


interface RequestConfig {
  url?: string;
  method?: string;
  data?: unknown;
  headers?: Record<string, string>;
}

interface ResponseInfo {
  status?: number;
  statusText?: string;
  data?: unknown;
}

export const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/api`,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const requestInfo: RequestConfig = {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers as Record<string, string>,
    };
    console.log('🚀 [AXIOS] Отправка запроса на бекенд:', requestInfo);
    return config;
  },
  (error) => {
    console.error('❌ [AXIOS] Ошибка в запросе:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    const responseInfo: ResponseInfo = {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    };
    console.log('✅ [AXIOS] Успешный ответ от бекенда:', responseInfo);
    return response;
  },
  (error) => {
    console.error('❌ [AXIOS] Ошибка ответа от бекенда:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
      },
    });
    return Promise.reject(error);
  }
);



