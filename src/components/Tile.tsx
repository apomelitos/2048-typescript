import { FC } from 'react';
import './Tile.scss';

type TileProps = {
  value: number;
  position: [number, number];
  isMerged?: boolean;
};

export const Tile: FC<TileProps> = ({ value, position: [row, col], isMerged }): JSX.Element => {
  return (
    <div className={`tile tile-${value} ${isMerged ? 'merged' : 'new'} row-${row + 1} col-${col + 1}`}>{value}</div>
  );
};
