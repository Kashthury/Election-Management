// Temporary adapter. Replace service implementations with API calls later.
// Keeping mock access behind an adapter prevents UI components from knowing
// whether data comes from memory, REST, or another backend.

const wait = <T,>(value: T, ms = 180): Promise<T> =>
  new Promise(resolve => setTimeout(() => resolve(structuredClone(value)), ms));

export const mockAdapter = {
  async get<T>(data: T): Promise<T> { return wait(data); },
  async save<T>(data: T): Promise<T> { return wait(data); },
};
