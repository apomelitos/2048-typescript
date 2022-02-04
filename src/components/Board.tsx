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

export const Board: FC<BoardProps> = ({ cols, rows, tiles }): JSX.Element => {
  const tileTotalWidth = 100;
  const boardPadding = 10;

  const containerWidht = tileTotalWidth * cols;

  const boardWidth = containerWidht + boardPadding * 2;

  return (
    <div className='board' style={{ width: boardWidth }}>
      {tiles.map((tile) => (
        <Tile key={tile.id} value={tile.value} position={tile.position} />
      ))}
      <Grid rows={rows} cols={cols} />
    </div>
  );
};
