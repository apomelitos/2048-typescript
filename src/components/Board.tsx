import { FC } from 'react';
import { Grid } from './Grid';

type BoardProps = {
  cols: number;
  rows: number;
};

export const Board: FC<BoardProps> = ({ cols, rows }): JSX.Element => {
  const tileTotalWidth = 100;
  const boardPadding = 10;

  const containerWidht = tileTotalWidth * cols;

  const boardWidth = containerWidht + boardPadding * 2;

  return (
    <div className='board' style={{ width: boardWidth }}>
      <Grid rows={rows} cols={cols} />
    </div>
  );
};
