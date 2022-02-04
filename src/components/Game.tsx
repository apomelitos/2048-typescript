import { FC } from 'react';
import { Board } from './Board';

const ROWS = 4;
const COLS = 4;

export const Game: FC = (): JSX.Element => {
  return (
    <div>
      <Board cols={COLS} rows={ROWS} />
    </div>
  );
};
