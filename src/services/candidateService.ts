import { adapter, useMock } from "./serviceMode";
import { initialCandidates } from "../mocks/electionData";
import type { Party } from "../types";

let mockData = structuredClone(initialCandidates);

export const candidateService = {
  getByDistrict: async (districtId: number | string): Promise<Party[]> =>
    useMock ? adapter.get(mockData[districtId] || []) : adapter.get(`/districts/${districtId}/candidates`),

  create: async (districtId: number | string, payload: Omit<Party, "id">): Promise<Party> => {
    if (useMock) {
      const list = mockData[districtId] || [];
      const item = { id: Date.now(), ...payload };
      mockData[districtId] = [...list, item];
      return adapter.save(item);
    }
    return adapter.post(`/districts/${districtId}/candidates`, payload);
  },

  update: async (districtId: number | string, candidateId: number, payload: Partial<Party>): Promise<Party> => {
    if (useMock) {
      const list = mockData[districtId] || [];
      const item = { ...list.find(candidate => candidate.id === candidateId), ...payload, id: candidateId };
      mockData[districtId] = list.map(candidate => candidate.id === candidateId ? item : candidate);
      return adapter.save(item);
    }
    return adapter.patch(`/districts/${districtId}/candidates/${candidateId}`, payload) as Promise<Party>;
  },

  delete: async (districtId: number | string, candidateId: number): Promise<boolean> => {
    if (useMock) {
      mockData[districtId] = (mockData[districtId] || []).filter(x => x.id !== candidateId);
      return adapter.save(true);
    }
    return adapter.delete(`/districts/${districtId}/candidates/${candidateId}`);
  },
};
