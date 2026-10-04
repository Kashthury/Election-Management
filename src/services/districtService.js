import { adapter, useMock } from "./serviceMode";
import { initialDistricts } from "../mocks/electionData";

let mockData = structuredClone(initialDistricts);

export const districtService = {
  getAll: async () => useMock ? adapter.get(mockData) : adapter.get("/districts"),
  create: async (payload) => {
    if (useMock) {
      const item = { id: Date.now(), ...payload };
      mockData = [...mockData, item];
      return adapter.save(item);
    }
    return adapter.post("/districts", payload);
  },
  update: async (id, payload) => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(`/districts/${id}`, payload);
  },
  delete: async (id) => {
    if (useMock) {
      mockData = mockData.filter(item => item.id !== id);
      return adapter.save(true);
    }
    return adapter.delete(`/districts/${id}`);
  },
  updateSeats: async (id, seats) => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, seats: Number(seats) } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(`/districts/${id}/seats`, { seats: Number(seats) });
  },
};
