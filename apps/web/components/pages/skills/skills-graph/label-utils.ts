import { round } from './round';

export const labelBelow = (x: number, y: number, offset: number) => {
  return {
    x: round(x),
    y: round(y + offset),
    textAnchor: 'middle' as const
  };
};
