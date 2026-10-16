import { adapter, useMock } from "../../lib/api";
import { initialDistricts } from "../../mocks/electionData";
import { apiEndpoint } from "../../utils/apiEndpoint";
import type { District } from "../../types";

let mockData = structuredClone(initialDistricts);

export const districtService = {
  getAll: async (): Promise<District[]> => useMock ? adapter.get(mockData) : adapter.get(apiEndpoint.districts.collection),
  create: async (payload: Omit<District, "id">): Promise<District> => {
    if (useMock) {
      const item = { id: Date.now(), ...payload };
      mockData = [...mockData, item];
      return adapter.save(item);
    }
    return adapter.post(apiEndpoint.districts.collection, payload);
  },
  update: async (id: number, payload: Partial<District>): Promise<District> => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(apiEndpoint.districts.byId(id), payload) as Promise<District>;
  },
  updateStatus: async (id: number, status: string): Promise<District> => {
    const payload = { status };
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, ...payload } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.patch(apiEndpoint.districts.byId(id), payload) as Promise<District>;
  },
  delete: async (id: number): Promise<boolean> => {
    if (useMock) {
      mockData = mockData.filter(item => item.id !== id);
      return adapter.save(true);
    }
    return adapter.delete(apiEndpoint.districts.byId(id));
  },
  updateSeats: async (id: number, seats: number): Promise<District> => {
    if (useMock) {
      mockData = mockData.map(item => item.id === id ? { ...item, seats: Number(seats) } : item);
      return adapter.save(mockData.find(item => item.id === id));
    }
    return adapter.put(apiEndpoint.districts.seats(id), { seats: Number(seats) }) as Promise<District>;
  },
};
