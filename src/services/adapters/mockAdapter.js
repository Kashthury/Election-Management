// Temporary adapter. Replace service implementations with API calls later.
// Keeping mock access behind an adapter prevents UI components from knowing
// whether data comes from memory, REST, or another backend.

const wait = (value, ms = 180) =>
  new Promise(resolve => setTimeout(() => resolve(structuredClone(value)), ms));

export const mockAdapter = {
  async get(data) { return wait(data); },
  async save(data) { return wait(data); },
};