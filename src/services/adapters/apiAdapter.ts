import httpClient from "../httpClient";
import type { AxiosRequestConfig } from "axios";

export const apiAdapter = {
  get: (url: string, config?: AxiosRequestConfig) => httpClient.get(url, config).then(r => r.data),
  post: (url: string, body?: unknown, config?: AxiosRequestConfig) => httpClient.post(url, body, config).then(r => r.data),
  put: (url: string, body?: unknown, config?: AxiosRequestConfig) => httpClient.put(url, body, config).then(r => r.data),
  patch: (url: string, body?: unknown, config?: AxiosRequestConfig) => httpClient.patch(url, body, config).then(r => r.data),
  delete: (url: string, config?: AxiosRequestConfig) => httpClient.delete(url, config).then(r => r.data),
};
