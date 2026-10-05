import { adapter, useMock } from "./serviceMode";
import { initialDistricts } from "../mocks/electionData";
import type { District } from "../types";

let mockData = structuredClone(initialDistricts);

export const districtService = {
  getAll: async (): Promise<District[]> => useMock ? adapter.get(mockData) : adapter.get("/districts"),
  create: async (payload: Omit<District, "id">): Promise<District> => {
    if (useMock) {
      const item = { id: Date.now(), ...payload };
      mockData = [...mockData, item];
      return adapter.save(item);
    }
    return adapter.post("/districts", payload);
  },
  update: async (id: number, payload: Partial<District>): Promise<District> => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(`/districts/${id}`, payload) as Promise<District>;
  },
  updateStatus: async (id: number, status: string): Promise<District> => {
    const payload = { status };
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.patch(`/districts/${id}`, payload) as Promise<District>;
  },
  delete: async (id: number): Promise<boolean> => {
    if (useMock) {
      mockData = mockData.filter(item => item.id !== id);
      return adapter.save(true);
    }
    return adapter.delete(`/districts/${id}`);
  },
  updateSeats: async (id: number, seats: number): Promise<District> => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, seats: Number(seats) } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(`/districts/${id}/seats`, { seats: Number(seats) }) as Promise<District>;
  },
};
