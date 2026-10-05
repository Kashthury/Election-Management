import { adapter, useMock } from "./serviceMode";
import { calculateElectionResult } from "../utils/electionCalculator";
import type { ElectionResult, Party } from "../types";

interface CalculateElectionPayload {
  district: string;
  seats: number;
  validVotes: number;
  disqualifiedPercentage: number;
  candidates: Party[];
}

export const electionService = {
  calculate: async (payload: CalculateElectionPayload): Promise<ElectionResult> => {
    if (useMock) return adapter.save(calculateElectionResult(payload));
    return adapter.post("/elections/calculate", payload) as Promise<ElectionResult>;
  },
};
