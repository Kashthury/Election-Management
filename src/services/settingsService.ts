import { adapter, useMock } from "./serviceMode";
import { initialSettings } from "../mocks/electionData";
import type { ElectionSettings } from "../types";

let mockSettings = structuredClone(initialSettings);

export const settingsService = {
  get: async (): Promise<ElectionSettings> => useMock ? adapter.get(mockSettings) : adapter.get("/settings/election"),
  update: async (payload: Partial<ElectionSettings>): Promise<ElectionSettings> => {
    if (useMock) {
      mockSettings = { ...mockSettings, ...payload };
      return adapter.save(mockSettings);
    }
    return adapter.put("/settings/election", payload) as Promise<ElectionSettings>;
  },
};
