import { FC } from 'react';
import './Tile.scss';

type TileProps = {
  value: number;
  position: [number, number];
  boardSize: number;
  isMerged?: boolean;
};

export const Tile: FC<TileProps> = ({ value, position: [row, col], isMerged, boardSize }): JSX.Element => {
  return (
    <div
      className={`tile-wrapper ${isMerged ? 'merged' : 'new'}`}
      style={{
        top: `${(row * 100) / boardSize}%`,
        left: `${(col * 100) / boardSize}%`,
      }}
    >
      <div className={`tile tile-${value}`}>{value}</div>
    </div>
  );
};
