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
    { id: 101, name: "Party A" },
    { id: 102, name: "Party B" },
    { id: 103, name: "Party C" },
    { id: 104, name: "Party D" },
    { id: 105, name: "Party E" },
  ],
  2: [
    { id: 201, name: "Party F" },
    { id: 202, name: "Party G" },
    { id: 203, name: "Party H" },
  ],
  4: [
    { id: 401, name: "Party I" },
    { id: 402, name: "Party J" },
    { id: 403, name: "Party K" },
    { id: 404, name: "Party L" },
  ],
};

export const initialSettings = {
  disqualifiedPercentage: 5,
};
