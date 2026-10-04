import { adapter, useMock } from "./serviceMode";
import { initialSettings } from "../mocks/electionData";

let mockSettings = structuredClone(initialSettings);

export const settingsService = {
  get: async () => useMock ? adapter.get(mockSettings) : adapter.get("/settings/election"),
  update: async (payload) => {
    if (useMock) {
      mockSettings = { ...mockSettings, ...payload };
      return adapter.save(mockSettings);
    }
    return adapter.put("/settings/election", payload);
  },
};