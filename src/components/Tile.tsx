import { FC, useEffect, useRef } from 'react';
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
  const tileRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!tileRef.current) return;

    const { top, left } = positionToPixels(position);
    tileRef.current.animate(
      [
        {
          top: `${top}px`,
          left: `${left}px`,
        },
      ],
      {
        fill: 'forwards',
        duration: 300,
      }
    );
  }, [position]);

  return (
    <div ref={tileRef} className={`tile tile-${value}`} style={positionToPixels(position)}>
      {value}
    </div>
  );
};
