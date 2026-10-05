import httpClient from "../httpClient";

export const apiAdapter = {
  get: (url, config) => httpClient.get(url, config).then(r => r.data),
  post: (url, body, config) => httpClient.post(url, body, config).then(r => r.data),
  put: (url, body, config) => httpClient.put(url, body, config).then(r => r.data),
  patch: (url, body, config) => httpClient.patch(url, body, config).then(r => r.data),
  delete: (url, config) => httpClient.delete(url, config).then(r => r.data),
};
