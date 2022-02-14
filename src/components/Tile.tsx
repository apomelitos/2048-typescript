import { FC } from 'react';
import './Tile.scss';

type TileProps = {
  value: number;
  position: [number, number];
  isMerged?: boolean;
  isNew?: boolean;
};

type TopLeftStyles = {
  top: number;
  left: number;
};

const positionToPixels = ([row, col]: number[]): TopLeftStyles => {
  return {
    top: row * 100 + 10,
    left: col * 100 + 10,
  };
};


export const Tile: FC<TileProps> = ({ value, position, isMerged = false, isNew = false }): JSX.Element => {
  return (
    <div
      className={`tile tile-${value} ${isMerged ? 'merged' : isNew ? 'new' : ''}`}
      style={positionToPixels(position)}
    >
      {value}
    </div>
  );
};
