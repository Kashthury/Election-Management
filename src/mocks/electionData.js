export const initialProvinces = [
  { id: 1, name: "Western Province", districtCount: 3 },
  { id: 2, name: "Central Province", districtCount: 3 },
  { id: 3, name: "Southern Province", districtCount: 3 },
];

export const initialDistricts = [
  { id: 1, provinceId: 1, provinceName: "Western Province", name: "Colombo", seats: 18 },
  { id: 2, provinceId: 1, provinceName: "Western Province", name: "Gampaha", seats: 19 },
  { id: 3, provinceId: 1, provinceName: "Western Province", name: "Kalutara", seats: 11 },
  { id: 4, provinceId: 2, provinceName: "Central Province", name: "Kandy", seats: 12 },
  { id: 5, provinceId: 2, provinceName: "Central Province", name: "Matale", seats: 5 },
  { id: 6, provinceId: 2, provinceName: "Central Province", name: "Nuwara Eliya", seats: 8 },
];

export const initialCandidates = {
  1: [
    { id: 101, name: "Candidate A" },
    { id: 102, name: "Candidate B" },
    { id: 103, name: "Candidate C" },
    { id: 104, name: "Candidate D" },
    { id: 105, name: "Candidate E" },
  ],
  2: [
    { id: 201, name: "Candidate F" },
    { id: 202, name: "Candidate G" },
    { id: 203, name: "Candidate H" },
  ],
  4: [
    { id: 401, name: "Candidate I" },
    { id: 402, name: "Candidate J" },
    { id: 403, name: "Candidate K" },
    { id: 404, name: "Candidate L" },
  ],
};

export const initialSettings = {
  disqualifiedPercentage: 5,
};