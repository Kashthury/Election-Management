import { adapter, useMock } from "../../lib/api";
import { initialSettings } from "../../mocks/electionData";
import { apiEndpoint } from "../../utils/apiEndpoint";
import type { ElectionSettings } from "../../types";

let mockSettings = structuredClone(initialSettings);

export const settingsService = {
  get: async (): Promise<ElectionSettings> => useMock ? adapter.get(mockSettings) : adapter.get(apiEndpoint.electionSettings),
  update: async (payload: Partial<ElectionSettings>): Promise<ElectionSettings> => {
    if (useMock) {
      mockSettings = { ...mockSettings, ...payload };
      return adapter.save(mockSettings);
    }
    return adapter.put(apiEndpoint.electionSettings, payload) as Promise<ElectionSettings>;
  },
};
