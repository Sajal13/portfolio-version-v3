export const STALE_TIME = 5 * 60;

export const getDate = (): number => {
  return new Date().getFullYear() ?? 2026;
};
