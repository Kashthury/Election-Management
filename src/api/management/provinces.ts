import { adapter, useMock } from "../../lib/api";
import { initialProvinces } from "../../mocks/electionData";
import { apiEndpoint } from "../../utils/apiEndpoint";
import type { Province } from "../../types";

let mockData = structuredClone(initialProvinces);

export const provinceService = {
  getAll: async (): Promise<Province[]> => useMock ? adapter.get(mockData) : adapter.get(apiEndpoint.provinces.collection),
  create: async (payload: Omit<Province, "id">): Promise<Province> => {
    if (useMock) {
      const item = { id: Date.now(), ...payload };
      mockData = [...mockData, item];
      return adapter.save(item);
    }
    return adapter.post(apiEndpoint.provinces.collection, payload);
  },
  update: async (id: number, payload: Partial<Province>): Promise<Province> => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(apiEndpoint.provinces.byId(id), payload) as Promise<Province>;
  },
  updateStatus: async (id: number, status: string): Promise<Province> => {
    const payload = { status };
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.patch(apiEndpoint.provinces.byId(id), payload) as Promise<Province>;
  },
  delete: async (id: number): Promise<boolean> => {
    if (useMock) {
      mockData = mockData.filter(item => item.id !== id);
      return adapter.save(true);
    }
    return adapter.delete(apiEndpoint.provinces.byId(id));
  },
};
