import { adapter, useMock } from "./serviceMode";
import { initialProvinces } from "../mocks/electionData";

let mockData = structuredClone(initialProvinces);

export const provinceService = {
  getAll: async () => useMock ? adapter.get(mockData) : adapter.get("/provinces"),
  create: async (payload) => {
    if (useMock) {
      const item = { id: Date.now(), ...payload };
      mockData = [...mockData, item];
      return adapter.save(item);
    }
    return adapter.post("/provinces", payload);
  },
  update: async (id, payload) => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(`/provinces/${id}`, payload);
  },
  updateStatus: async (id, status) => {
    const payload = { status };
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.patch(`/provinces/${id}`, payload);
  },
  delete: async (id) => {
    if (useMock) {
      mockData = mockData.filter(item => item.id !== id);
      return adapter.save(true);
    }
    return adapter.delete(`/provinces/${id}`);
  },
};
