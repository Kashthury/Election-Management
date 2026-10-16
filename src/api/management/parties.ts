import { adapter, useMock } from "../../lib/api";
import { initialParties } from "../../mocks/electionData";
import { apiEndpoint } from "../../utils/apiEndpoint";
import type { Party } from "../../types";

let mockData = structuredClone(initialParties);

export const partyService = {
  getByDistrict: async (districtId: number | string): Promise<Party[]> =>
    useMock ? adapter.get(mockData[districtId] || []) : adapter.get(apiEndpoint.parties.byDistrict(districtId)),

  create: async (districtId: number | string, payload: Omit<Party, "id">): Promise<Party> => {
    if (useMock) {
      const list = mockData[districtId] || [];
      const item = { id: Date.now(), ...payload };
      mockData[districtId] = [...list, item];
      return adapter.save(item);
    }
    return adapter.post(apiEndpoint.parties.byDistrict(districtId), payload);
  },

  update: async (districtId: number | string, partyId: number, payload: Partial<Party>): Promise<Party> => {
    if (useMock) {
      const list = mockData[districtId] || [];
      const item = { ...list.find(party => party.id === partyId), ...payload, id: partyId };
      mockData[districtId] = list.map(party => party.id === partyId ? item : party);
      return adapter.save(item);
    }
    return adapter.patch(apiEndpoint.parties.byId(districtId, partyId), payload) as Promise<Party>;
  },

  delete: async (districtId: number | string, partyId: number): Promise<boolean> => {
    if (useMock) {
      mockData[districtId] = (mockData[districtId] || []).filter(item => item.id !== partyId);
      return adapter.save(true);
    }
    return adapter.delete(apiEndpoint.parties.byId(districtId, partyId));
  },
};
