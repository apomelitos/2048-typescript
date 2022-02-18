import { FC } from 'react';
import './Tile.scss';

type TileProps = {
  value: number;
  position: [number, number];
  isMerged?: boolean;
};

type TopLeftStyles = {
  top: number | string;
  left: number | string;
};

const positionToPixels = ([row, col]: [number, number]): TopLeftStyles => {
  const tileMargin = window.innerWidth <= 500 ? 5 : 10;

  return {
    top: `calc(${row} * ((100% - 20px) / 4) + ${tileMargin}px)`,
    left: `calc(${col} * ((100% - 20px) / 4) + ${tileMargin}px)`,
  };
};

export const Tile: FC<TileProps> = ({ value, position, isMerged }): JSX.Element => {
  return (
    <div className={`tile tile-${value} ${isMerged ? 'merged' : 'new'}`} style={positionToPixels(position)}>
      {value}
    </div>
  );
};
