import { FC, useState, useRef } from 'react';
import { TileMeta, Direction } from '../types';
import { useHandleButtons } from '../hooks/useHandleButtons';
import {
  moveState,
  hasPossibleMoves,
  mergeState,
  generateRandomTile,
  getScoreFromMergePairs,
  generateInitialTiles,
} from '../utils/gameUtils';
import { Tile } from './Tile';
import { Grid } from './Grid';
import { Header } from './Header';
import { VideoControl } from './VideoControl';
import './Game.scss';

const SIZE = 4;
const TILE_TOTAL_WIDTH = 100;
const BOARD_PADDING = 10;
const CONTAINER_WIDTH = TILE_TOTAL_WIDTH * SIZE;
const BOARD_WIDTH = CONTAINER_WIDTH + BOARD_PADDING * 2;

type GameState = {
  tiles: TileMeta[];
  score: number;
};

export const Game: FC = (): JSX.Element => {
  const [tiles, setTiles] = useState<TileMeta[]>(generateInitialTiles(SIZE));
  const [prevState, setPrevState] = useState<GameState | null>(null);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(parseInt(window.localStorage.getItem('2048_best') || '0'));

  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [shouldShowWinOverlay, setShouldShowWinOverlay] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(false);

  const isMovingRef = useRef(false);

  const updateState = (direction: Direction) => {
    isMovingRef.current = true;

    const [movedState, mergePairs, changesCount] = moveState(SIZE, tiles, direction);
    setTiles(movedState);

    if (changesCount > 0) {
      setPrevState({ tiles, score });
    }

    if (changesCount === 0) {
      isMovingRef.current = false;
      return;
    }

    setTimeout(() => {
      const currentState = mergeState(movedState, mergePairs);

      if (currentState.some((tile) => tile.value === 2048)) {
        setIsGameWon(true);
      }

      currentState.push(generateRandomTile(SIZE, currentState));
      const hasMoves = hasPossibleMoves(SIZE, currentState);
      if (!hasMoves) setIsGameOver(true);

      const newScore = score + getScoreFromMergePairs(mergePairs);

      if (newScore > bestScore) {
        window.localStorage.setItem('2048_best', newScore.toString());
        setBestScore(newScore);
      }

      setTiles(currentState);
      setScore(newScore);

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
    setTiles(generateInitialTiles(SIZE));
    setPrevState(null);
    setIsGameOver(false);
    setShouldShowWinOverlay(true);
  };

  return (
    <>
      <div className='wrapper'>
        <Header
          onStartNewGame={startNewGameHandler}
          onRevertStateBack={revertStateBackHandler}
          score={score}
          bestScore={bestScore}
          setIsVideoEnabled={setIsVideoEnabled}
        />
        <div className='board' style={{ width: BOARD_WIDTH, position: 'relative' }}>
          {isGameWon && shouldShowWinOverlay && (
            <div className='overlay win'>
              you won
              <button className='btn' onClick={() => setShouldShowWinOverlay(false)}>
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

        <VideoControl
          isVideoEnabled={isVideoEnabled}
          WIDTH={320}
          HEIGHT={240}
          onDirectionChange={updateState}
          isMovingRef={isMovingRef}
        />
      </div>
    </>
  );
};
