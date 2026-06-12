export const getBadgeColors = (score: number) => {
  if (score >= 85) return 'bg-[#06D6A0] text-black border-black shadow-[4px_4px_0_#000]';
  if (score >= 60) return 'bg-[#FFD166] text-black border-black shadow-[4px_4px_0_#000]';
  return 'bg-[#FF6D87] text-black border-black shadow-[4px_4px_0_#000]';
};
