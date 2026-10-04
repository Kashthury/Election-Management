import { adapter, useMock } from "./serviceMode";
import { initialCandidates } from "../mocks/electionData";

let mockData = structuredClone(initialCandidates);

export const candidateService = {
  getByDistrict: async (districtId) =>
    useMock ? adapter.get(mockData[districtId] || []) : adapter.get(`/districts/${districtId}/candidates`),

  create: async (districtId, payload) => {
    if (useMock) {
      const list = mockData[districtId] || [];
      const item = { id: Date.now(), ...payload };
      mockData[districtId] = [...list, item];
      return adapter.save(item);
    }
    return adapter.post(`/districts/${districtId}/candidates`, payload);
  },

  delete: async (districtId, candidateId) => {
    if (useMock) {
      mockData[districtId] = (mockData[districtId] || []).filter(x => x.id !== candidateId);
      return adapter.save(true);
    }
    return adapter.delete(`/districts/${districtId}/candidates/${candidateId}`);
  },
};