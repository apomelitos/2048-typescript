import { FC, useState, useCallback, useRef, useEffect } from 'react';
import { TileMeta, Direction } from '../types';
import { useHandleButtons } from '../hooks/useHandleButtons';
import {
  moveState,
  hasPossibleMoves,
  mergeState,
  generateRandomTile,
  getScoreFromMergePairs,
} from '../utils/gameUtils';
import { Tile } from './Tile';
import { Grid } from './Grid';
import { Header } from './Header';
import './Game.scss';

const SIZE = 4;
const TILE_TOTAL_WIDTH = 100;
const BOARD_PADDING = 10;
const CONTAINER_WIDTH = TILE_TOTAL_WIDTH * SIZE;
const BOARD_WIDTH = CONTAINER_WIDTH + BOARD_PADDING * 2;

const initialState: TileMeta[] = [
  {
    id: 1,
    value: 2,
    position: [0, 0],
  },
  {
    id: 2,
    value: 2,
    position: [1, SIZE - 1],
  },
];

type GameState = {
  tiles: TileMeta[];
  score: number;
};

export const Game: FC = (): JSX.Element => {
  const [tiles, setTiles] = useState<TileMeta[]>(initialState);
  const [prevState, setPrevState] = useState<GameState | null>(null);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(parseInt(window.localStorage.getItem('2048_best') || '0'));

  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [showWinOverlay, setShowWinOverlay] = useState(true);

  const isMovingRef = useRef(false);

  const updateState = (direction: Direction) => {
    isMovingRef.current = true;

    let movedState: TileMeta[];
    let mergePairs: [TileMeta, TileMeta][];
    let changesCount = 0;
    let prevTiles: TileMeta[];

    setTiles((prev) => {
      [movedState, mergePairs, changesCount] = moveState(SIZE, prev, direction);

      if (changesCount > 0) prevTiles = prev;

      return movedState;
    });

    if (changesCount === 0) {
      isMovingRef.current = false;
      return;
    }

    setTimeout(() => {
      let hasMoves;

      setTiles((prev) => {
        const currentState = mergeState(prev, mergePairs);
        currentState.push(generateRandomTile(SIZE, currentState));
        hasMoves = hasPossibleMoves(SIZE, currentState);

        return currentState;
      });

      if (!hasMoves) setIsGameOver(true);

      setScore((prev) => {
        setPrevState({ tiles: prevTiles, score: prev });

        return prev + getScoreFromMergePairs(mergePairs);
      });

      isMovingRef.current = false;
    }, 300); // Should be the same as in CSS
  };

  useHandleButtons(updateState, isMovingRef);

  const revertStateBackHandler = () => {
    if (isGameOver) setIsGameOver(false);

    if (prevState !== null) {
      setTiles(prevState.tiles);
      setScore(prevState.score);
    }
  };

  const startNewGameHandler = () => {
    setScore(0);
    setTiles(initialState);
    setPrevState(null);
    setIsGameOver(false);
  };

  const saveBestScore = useCallback(() => {
    window.localStorage.setItem('2048_best', Math.max(score, bestScore).toString());
  }, [score, bestScore]);

  useEffect(() => {
    if (!showWinOverlay) return;

    if (tiles.some((tile) => tile.value === 2048)) setIsGameWon(true);
  }, [tiles, showWinOverlay]);

  useEffect(() => {
    setBestScore((prev) => Math.max(prev, score));

    return saveBestScore;
  }, [saveBestScore, score]);

  return (
    <>
      <Header
        onStartNewGame={startNewGameHandler}
        onRevertStateBack={revertStateBackHandler}
        score={score}
        bestScore={bestScore}
      />
      <div className='board' style={{ width: BOARD_WIDTH, position: 'relative' }}>
        {isGameWon && showWinOverlay && (
          <div className='overlay win'>
            you won
            <button
              className='btn'
              onClick={() => {
                setIsGameWon(false);
                setShowWinOverlay(false);
              }}
            >
              Continue
            </button>
          </div>
        )}
        {isGameOver && <div className='overlay'>game over</div>}
        {tiles
          .sort((a, b) => a.id - b.id) // Required for CSS transitions
          .map(({ id, value, position, isMerged }) => (
            <Tile key={id} value={value} position={position} isMerged={isMerged} />
          ))}
        <Grid size={SIZE} />
      </div>
    </>
  );
};
