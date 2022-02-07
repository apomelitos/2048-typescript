import { FC, useState } from 'react';
import { TileMeta } from '../types';
import { Board } from './Board';

const ROWS = 4;
const COLS = 4;

export const Game: FC = (): JSX.Element => {
  const [state, setState] = useState<TileMeta[]>([]);

  return (
    <div>
      <Board cols={COLS} rows={ROWS} tiles={state} />
    </div>
  );
};
