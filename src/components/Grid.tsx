import { FC } from 'react';
import './Grid.scss';

type GridProps = {
  size: number;
};

export const Grid: FC<GridProps> = ({ size }): JSX.Element => {
  return (
    <div className='grid'>
      {Array(size * size)
        .fill(0)
        .map((elem, idx) => (
          <div key={idx} className='grid-cell' />
        ))}
    </div>
  );
};
