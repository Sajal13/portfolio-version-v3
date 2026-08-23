export function labelBelow(x: number, y: number, offset: number) {
  return {
    x,
    y: y + offset,
    textAnchor: 'middle' as const
  };
}
