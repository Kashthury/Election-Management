const encodeId = (id: number | string) => encodeURIComponent(String(id));

export const apiEndpoint = {
  provinces: {
    collection: "/provinces",
    byId: (id: number) => `/provinces/${encodeId(id)}`,
  },
  districts: {
    collection: "/districts",
    byId: (id: number) => `/districts/${encodeId(id)}`,
    seats: (id: number) => `/districts/${encodeId(id)}/seats`,
  },
  parties: {
    byDistrict: (districtId: number | string) => `/districts/${encodeId(districtId)}/parties`,
    byId: (districtId: number | string, partyId: number) =>
      `/districts/${encodeId(districtId)}/parties/${encodeId(partyId)}`,
  },
  electionSettings: "/settings/election",
  calculateElection: "/elections/calculate",
} as const;
