export interface Province {
  id: number;
  name: string;
  districtCount?: number;
  status?: string;
}

export interface District {
  id: number;
  provinceId: number;
  provinceName: string;
  name: string;
  seats: number;
  status?: string;
}

export interface Party {
  id: number;
  name: string;
  districtId?: number;
  votes?: number;
  qualified?: boolean;
  round1?: number;
  round2?: number;
  totalSeats?: number;
  bonus?: boolean;
}

export type CandidatesByDistrict = Record<string, Party[]>;

export interface ElectionSettings {
  disqualifiedPercentage: number;
}

export interface ElectionResult {
  district: string;
  seats: number;
  validVotes: number;
  threshold: number;
  disqualifiedVotes: number;
  qualifyingVotes: number;
  allocation: number;
  candidates: Party[];
  logId?: string;
  calculatedAt?: string;
}

export interface ResultLogEntry extends ElectionResult {
  logId: string;
  calculatedAt: string;
}
