import { adapter, useMock } from "../../lib/api";
import { calculateElectionResult } from "../../utils/electionCalculator";
import { apiEndpoint } from "../../utils/apiEndpoint";
import type { ElectionResult, Party } from "../../types";

interface CalculateElectionPayload {
  district: string;
  seats: number;
  validVotes: number;
  disqualifiedPercentage: number;
  parties: Party[];
}

export const electionService = {
  calculate: async (payload: CalculateElectionPayload): Promise<ElectionResult> => {
    if (useMock) return adapter.save(calculateElectionResult(payload));
    return adapter.post(apiEndpoint.calculateElection, payload) as Promise<ElectionResult>;
  },
};
