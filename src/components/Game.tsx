import { FC, useState } from 'react';
import { TileMeta } from '../types';
import { useHandleButtons } from '../hooks/useHandleButtons';
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
    position: [1, 1],
  },
  {
    id: 2,
    value: 4,
    position: [0, 2],
  },
  {
    id: 3,
    value: 4,
    position: [1, 2],
  },
  {
    id: 4,
    value: 4,
    position: [2, 2],
  },
];

export const Game: FC = (): JSX.Element => {
  const [tiles, setTiles] = useState<TileMeta[]>(initialState);

  useHandleButtons(setTiles);

  return (
    <div className='board' style={{ width: BOARD_WIDTH, position: 'relative' }}>
      {tiles.map(({ id: key, value, position }) => (
        <Tile {...{ key, value, position }} />
      ))}
      <Grid rows={ROWS} cols={COLS} />
    </div>
  );
};
