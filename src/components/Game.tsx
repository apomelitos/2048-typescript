import { FC, useState } from 'react';
import { TileMeta } from '../types';
import { useHandleButtons } from '../hooks/useHandleButtons';
import { Tile } from './Tile';
import { Grid } from './Grid';
import { Header } from './Header';
import './Game.scss';

const ROWS = 4;
const COLS = 4;
const TILE_TOTAL_WIDTH = 100;
const BOARD_PADDING = 10;
const CONTAINER_WIDTH = TILE_TOTAL_WIDTH * COLS;
const BOARD_WIDTH = CONTAINER_WIDTH + BOARD_PADDING * 2;

const initialState: TileMeta[] = [
  {
    id: 1,
    value: 2,
    position: [1, 1],
  },
  {
    id: 2,
    value: 4,
    position: [0, 2],
  },
  {
    id: 3,
    value: 4,
    position: [1, 2],
  },
  {
    id: 4,
    value: 4,
    position: [2, 2],
  },
];

export const Game: FC = (): JSX.Element => {
  const [tiles, setTiles] = useState<TileMeta[]>(initialState);
  const [prevState, setPrevState] = useState<TileMeta[] | null>(null);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);

  useHandleButtons(setTiles, setScore, setPrevState, setIsGameOver);

  const revertStateBackHandler = () => {
    if (isGameOver) setIsGameOver(false);
    if (prevState !== null) setTiles(prevState);
  };

  const startNewGameHandler = () => {
    setScore(0);
    setTiles(initialState);
    setPrevState(null);
    setIsGameOver(false);
  };

  return (
    <>
      <Header onStartNewGame={startNewGameHandler} onRevertStateBack={revertStateBackHandler} score={score} />
      <div className='board' style={{ width: BOARD_WIDTH, position: 'relative' }}>
        {isGameOver && <div className='game-over'>GAME OVER</div>}
        {tiles
          .sort((a, b) => a.id - b.id) // Required for CSS transitions
          .map(({ id, value, position, isMerged }) => (
            <Tile key={id} value={value} position={position} isMerged={isMerged} />
          ))}
        <Grid rows={ROWS} cols={COLS} />
      </div>
    </>
  );
};
