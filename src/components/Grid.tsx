import { FC } from 'react';
import { TileMeta } from '../types';
import './Grid.scss';
import { Tile } from './Tile';
import { ANIMATION_DURATION } from '../configs/consts';

type GridProps = {
  size: number;
  tiles: TileMeta[];
};

export const Grid: FC<GridProps> = ({ size, tiles, children }): JSX.Element => {
  const style = {
    '--cell-size': `${100 / size}%`,
    '--merge-duration': `${ANIMATION_DURATION}ms`,
  } as React.CSSProperties;

  return (
    <div className='grid' style={style}>
      {children}
      {tiles
        .sort((a, b) => a.id - b.id) // Required for CSS transitions
        .map(({ id, value, position, isMerged }) => (
          <Tile key={id} value={value} position={position} isMerged={isMerged} boardSize={size} />
        ))}

      {Array(size * size)
        .fill(0)
        .map((_, idx) => (
          <div key={`cell-${idx}`} className='grid-cell'>
            <div className='grid-cell-inner' />
          </div>
        ))}
    </div>
  );
};
