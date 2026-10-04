import { adapter, useMock } from "./serviceMode";
import { calculateElectionResult } from "../utils/electionCalculator";

export const electionService = {
  calculate: async (payload) => {
    if (useMock) return adapter.save(calculateElectionResult(payload));
    return adapter.post("/elections/calculate", payload);
  },
};