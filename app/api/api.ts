<<<<<<< Updated upstream
// app/api/api.ts

import axios, { AxiosError } from 'axios';

export type ApiError = AxiosError<{ error: string }>;

 
const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + '/api';

export const api = axios.create({
  baseURL: BASE_URL, 
  withCredentials: true, 
=======
import qs from "qs";
import axios, { AxiosError } from "axios";

export type ApiError = AxiosError<{ error: string }>;

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL + "/api";

export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
>>>>>>> Stashed changes
});
