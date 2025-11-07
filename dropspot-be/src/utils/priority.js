const deriveCoefficients = (seed) => {
  const hex = (a,b) => parseInt(seed.slice(a,b), 16);
  const A = 7  + (hex(0,2) % 5);
  const B = 13 + (hex(2,4) % 7);
  const C = 3  + (hex(4,6) % 3);
  return { A, B, C };
};

const computePriorityScore = ({ base = 0, signup_latency_ms, account_age_days, rapid_actions, seed }) => {
  const { A, B, C } = deriveCoefficients(seed);
  return base + (signup_latency_ms % A) + (account_age_days % B) - (rapid_actions % C);
};

module.exports = { deriveCoefficients, computePriorityScore };
