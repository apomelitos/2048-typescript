import { FC } from 'react';
import './Grid.scss';

type GridProps = {
  rows: number;
  cols: number;
};

export const Grid: FC<GridProps> = ({ rows, cols }): JSX.Element => {
  return (
    <div className='grid'>
      {Array(rows * cols)
        .fill(0)
        .map((elem, idx) => (
          <div key={idx} className='grid__cell' />
        ))}
    </div>
  );
};
