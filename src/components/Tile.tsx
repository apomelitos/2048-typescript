import { FC, useEffect, useRef, useState } from 'react';
import { usePrevValue } from '../hooks/usePrevValue';
import './Tile.scss';

type TileProps = {
  value: number;
  position: [number, number];
};

type TopLeftStyles = {
  top: string;
  left: string;
};

const positionToPixels = ([row, col]: number[]): TopLeftStyles => {
  return {
    // 100 is tile size with margins
    top: `${col * 100 + 10}px`,
    left: `${row * 100 + 10}px`,
  };
};

export const Tile: FC<TileProps> = ({ value, position }): JSX.Element => {
  const [tileValue, setTileValue] = useState(value);
  const tileRef = useRef<HTMLDivElement | null>(null);
  const prevValue = usePrevValue(tileValue);

  const shallAnimate = prevValue !== tileValue;

  useEffect(() => {
    if (!tileRef.current) return;

    tileRef.current.animate([positionToPixels(position)], {
      duration: 300,
      fill: 'forwards',
    });

    if (shallAnimate) {
      tileRef.current.animate(
        [
          { transform: 'scale(1) rotate(0deg)' },
          { transform: 'scale(1.2) rotate(180deg)' },
          { transform: 'scale(1) rotate(0deg)' },
        ],
        {
          duration: 300,
        }
      );
    }
  }, [position, shallAnimate]);

  return (
    <div className={`tile tile-${tileValue}`} ref={tileRef} style={{ zIndex: tileValue }}>
      {prevValue || tileValue}
    </div>
  );
};
