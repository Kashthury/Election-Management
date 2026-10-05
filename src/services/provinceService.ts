import { adapter, useMock } from "./serviceMode";
import { initialProvinces } from "../mocks/electionData";
import type { Province } from "../types";

let mockData = structuredClone(initialProvinces);

export const provinceService = {
  getAll: async (): Promise<Province[]> => useMock ? adapter.get(mockData) : adapter.get("/provinces"),
  create: async (payload: Omit<Province, "id">): Promise<Province> => {
    if (useMock) {
      const item = { id: Date.now(), ...payload };
      mockData = [...mockData, item];
      return adapter.save(item);
    }
    return adapter.post("/provinces", payload);
  },
  update: async (id: number, payload: Partial<Province>): Promise<Province> => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(`/provinces/${id}`, payload) as Promise<Province>;
  },
  updateStatus: async (id: number, status: string): Promise<Province> => {
    const payload = { status };
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.patch(`/provinces/${id}`, payload) as Promise<Province>;
  },
  delete: async (id: number): Promise<boolean> => {
    if (useMock) {
      mockData = mockData.filter(item => item.id !== id);
      return adapter.save(true);
    }
    return adapter.delete(`/provinces/${id}`);
  },
};
