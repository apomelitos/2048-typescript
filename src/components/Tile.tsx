import { FC, useState } from 'react';
import './Tile.scss';

type TileProps = {
  value: number;
  position: [number, number];
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

export const Tile: FC<TileProps> = ({ value, position }): JSX.Element => {
  const [tileValue, setTileValue] = useState(value);

  return (
    <div className={`tile tile-${tileValue}`} style={positionToPixels(position)}>
      {tileValue}
    </div>
  );
};
