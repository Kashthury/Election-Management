/**
 * Mirrors the supplied Pascal calculation flow for frontend demonstration.
 * In production, use the Spring Boot service as the authoritative calculation.
 */
export function calculateElectionResult({
  district,
  seats,
  validVotes,
  candidates,
  disqualifiedPercentage,
}) {
  const votes = candidates.map(c => Number(c.votes || 0));
  const totalCandidateVotes = votes.reduce((sum, value) => sum + value, 0);

  if (totalCandidateVotes !== Number(validVotes)) {
    throw new Error("Candidate vote total must equal valid votes.");
  }
  if (Number(seats) <= 1) {
    throw new Error("Number of seats must be greater than 1.");
  }

  const threshold = Math.floor(Number(validVotes) * Number(disqualifiedPercentage) / 100);
  const qualified = votes.map(v => v >= threshold);
  const disqualifiedVotes = votes.reduce((sum, v, i) => sum + (qualified[i] ? 0 : v), 0);
  const qualifyingVotes = Number(validVotes) - disqualifiedVotes;

  let bonusIndex = 0;
  for (let i = 1; i < votes.length; i++) {
    if (votes[i] > votes[bonusIndex]) bonusIndex = i;
  }

  const allocation = Math.floor(qualifyingVotes / (Number(seats) - 1));
  const round1 = votes.map((v, i) =>
    qualified[i] && allocation > 0 ? Math.floor(v / allocation) : 0
  );

  const allocatedSeat = round1.reduce((sum, value) => sum + value, 0);
  let balanceSeats = Math.max(0, (Number(seats) - 1) - allocatedSeat);

  const balances = votes.map((v, i) =>
    qualified[i] && allocation > 0 ? v % allocation : 0
  );

  const round2 = votes.map(() => 0);
  const found = new Set();

  while (balanceSeats > 0) {
    let index = -1;
    let maxBalance = -1;

    for (let i = 0; i < candidates.length; i++) {
      if (qualified[i] && !found.has(i) && balances[i] > maxBalance) {
        index = i;
        maxBalance = balances[i];
      }
    }

    if (index === -1) break;
    found.add(index);
    round2[index] = 1;
    balanceSeats--;
  }

  const totalSeats = candidates.map((_, i) =>
    round1[i] + round2[i] + (i === bonusIndex ? 1 : 0)
  );

  return {
    district,
    seats: Number(seats),
    validVotes: Number(validVotes),
    threshold,
    disqualifiedVotes,
    qualifyingVotes,
    allocation,
    candidates: candidates.map((c, i) => ({
      ...c,
      votes: votes[i],
      qualified: qualified[i],
      round1: round1[i],
      round2: round2[i],
      totalSeats: totalSeats[i],
      bonus: i === bonusIndex,
    })),
  };
}