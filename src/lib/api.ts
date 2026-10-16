import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  headers: { "Content-Type": "application/json" },
});

export const useMock = String(import.meta.env.VITE_USE_MOCK ?? "true").toLowerCase() === "true";

type Adapter = {
  get: (target: unknown, config?: AxiosRequestConfig) => Promise<any>;
  post: (url: string, body?: unknown, config?: AxiosRequestConfig) => Promise<any>;
  put: (url: string, body?: unknown, config?: AxiosRequestConfig) => Promise<any>;
  patch: (url: string, body?: unknown, config?: AxiosRequestConfig) => Promise<any>;
  delete: (url: string, config?: AxiosRequestConfig) => Promise<any>;
  save: (data: unknown) => Promise<any>;
};

const wait = <T,>(value: T, ms = 180): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(structuredClone(value)), ms));

const mockAdapter: Adapter = {
  get: data => wait(data),
  post: (_url, body) => wait(body),
  put: (_url, body) => wait(body),
  patch: (_url, body) => wait(body),
  delete: () => wait(true),
  save: data => wait(data),
};

const apiAdapter: Adapter = {
  get: (url, config) => api.get(String(url), config).then(response => response.data),
  post: (url, body, config) => api.post(url, body, config).then(response => response.data),
  put: (url, body, config) => api.put(url, body, config).then(response => response.data),
  patch: (url, body, config) => api.patch(url, body, config).then(response => response.data),
  delete: (url, config) => api.delete(url, config).then(response => response.data),
  save: data => Promise.resolve(data),
};

export const adapter = useMock ? mockAdapter : apiAdapter;
export default api;
