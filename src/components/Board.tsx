import { FC } from 'react';
import { TileMeta } from '../types';
import { Grid } from './Grid';
import { Tile } from './Tile';
import './Board.scss';

type BoardProps = {
  cols: number;
  rows: number;
  tiles: TileMeta[];
};

const TILE_TOTAL_WIDTH = 100;
const BOARD_PADDING = 10;

export const Board: FC<BoardProps> = ({ cols, rows, tiles }): JSX.Element => {
  // containerWidth depends on cols prop
  const containerWidht = TILE_TOTAL_WIDTH * cols;
  const boardWidth = containerWidht + BOARD_PADDING * 2;

  return (
    <div className='board' style={{ width: boardWidth }}>
      {tiles.map((tile) => (
        <Tile key={tile.id} value={tile.value} position={tile.position} />
      ))}
      <Grid rows={rows} cols={cols} />
    </div>
  );
};
