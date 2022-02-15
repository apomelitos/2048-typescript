export type TileMeta = {
  id: number;
  value: number;
  position: [number, number];
  isMerged?: boolean;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
