import { FC } from 'react';
import { TileMeta } from '../types';
import './Grid.scss';
import { Tile } from './Tile';

type GridProps = {
  size: number;
  tiles: TileMeta[];
};

export const Grid: FC<GridProps> = ({ size, tiles }): JSX.Element => {
  const style = {
    '--cell-size': `${100 / size}%`,
  } as React.CSSProperties;

  return (
    <div className='grid' style={style}>
      {tiles
        .sort((a, b) => a.id - b.id) // Required for CSS transitions
        .map(({ id, value, position, isMerged }) => (
          <Tile key={id} value={value} position={position} isMerged={isMerged} boardSize={size} />
        ))}

      {Array(size * size)
        .fill(0)
        .map((_, idx) => (
          <div className='grid-cell'>
            <div key={`cell-${idx}`} className='grid-cell-inner' />
          </div>
        ))}
    </div>
  );
};
