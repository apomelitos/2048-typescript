import { FC, useState } from 'react';
import { TileMeta } from '../types';
import { Tile } from './Tile';
import { Grid } from './Grid';

const ROWS = 4;
const COLS = 4;
const TILE_TOTAL_WIDTH = 100;
const BOARD_PADDING = 10;
const CONTAINER_WIDTH = TILE_TOTAL_WIDTH * COLS;
const BOARD_WIDTH = CONTAINER_WIDTH + BOARD_PADDING * 2;

const initialState: TileMeta[] = [
  {
    id: 1,
    value: 2,
    position: [0, 0],
  },
  {
    id: 2,
    value: 4,
    position: [0, 1],
  },
];

export const Game: FC = (): JSX.Element => {
  const [tiles] = useState<TileMeta[]>(initialState);

  return (
    <div className='board' style={{ width: BOARD_WIDTH, position: 'relative' }}>
      {tiles.map((tile) => (
        <Tile key={tile.id} value={tile.value} position={tile.position} />
      ))}
      <Grid rows={ROWS} cols={COLS} />
    </div>
  );
};
