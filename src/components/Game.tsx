import { FC, useState, useRef, useEffect } from 'react';
import { TileMeta, Direction } from '../types';
import { useHandleButtons } from '../hooks/useHandleButtons';
import { useHandleTouches } from '../hooks/useHandleTouches';
import {
  moveState,
  hasPossibleMoves,
  mergeState,
  generateRandomTile,
  getScoreFromMergePairs,
  generateInitialTiles,
} from '../utils/gameUtils';
import { Grid } from './Grid';
import { Header } from './Header';
import { VideoControl } from './VideoControl';
import { ANIMATION_DURATION } from '../configs/consts';
import './Game.scss';

const DEFAULT_SIZE = 4;

type GameState = {
  tiles: TileMeta[];
  score: number;
};

export const Game: FC = (): JSX.Element => {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [tiles, setTiles] = useState<TileMeta[]>(generateInitialTiles(size));
  const [prevState, setPrevState] = useState<GameState | null>(null);

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(parseInt(window.localStorage.getItem('2048_best') || '0'));

  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameWon, setIsGameWon] = useState(false);
  const [shouldShowWinOverlay, setShouldShowWinOverlay] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState<boolean>(false);

  const isMovingRef = useRef(false);

  const updateState = (direction: Direction) => {
    if (isMovingRef.current || isGameOver || (isGameWon && shouldShowWinOverlay)) return;

    isMovingRef.current = true;

    const [movedState, mergePairs, changesCount] = moveState(size, tiles, direction);
    setTiles(movedState);

    if (changesCount === 0) {
      isMovingRef.current = false;
      return;
    }

    setPrevState({ tiles, score });

    setTimeout(() => {
      const currentState = mergeState(movedState, mergePairs);
      const newScore = score + getScoreFromMergePairs(mergePairs);

      currentState.push(generateRandomTile(size, currentState));

      const hasMoves = hasPossibleMoves(size, currentState);

      if (currentState.some((tile) => tile.value === 2048)) {
        setIsGameWon(true);
      }

      if (newScore > bestScore) {
        window.localStorage.setItem('2048_best', newScore.toString());
        setBestScore(newScore);
      }

      setTiles(currentState);
      setScore(newScore);
      setIsGameOver(!hasMoves);

      isMovingRef.current = false;
    }, ANIMATION_DURATION); // Should be the same as in CSS
  };

  useHandleButtons(updateState);
  const [onTouchStart, onTouchEnd] = useHandleTouches(updateState);

  const revertStateBackHandler = () => {
    if (isGameOver) setIsGameOver(false);

    if (prevState !== null) {
      setTiles(prevState.tiles);
      setScore(prevState.score);
      setPrevState(null);
    }
  };

  const startNewGameHandler = (size: number) => {
    setScore(0);
    setTiles(generateInitialTiles(size));
    setPrevState(null);
    setIsGameOver(false);
    setShouldShowWinOverlay(true);
  };

  useEffect(() => {
    startNewGameHandler(size);
  }, [size]);

  const overlay = isGameWon
    ? shouldShowWinOverlay && (
        <div className='overlay win'>
          you won
          <button
            className='btn'
            onClick={() => setShouldShowWinOverlay(false)}
            onTouchStart={() => setShouldShowWinOverlay(false)}
          >
            Continue
          </button>
        </div>
      )
    : isGameOver && <div className='overlay'>game over</div>;

  return (
    <>
      <div className='wrapper'>
        <Header
          onStartNewGame={startNewGameHandler}
          onRevertStateBack={revertStateBackHandler}
          score={score}
          bestScore={bestScore}
          boardSize={size}
          prevStateIsNull={prevState === null}
          onEnableWebCamGestures={setIsVideoEnabled}
          onResizeBoard={setSize}
        />
        <div className='board' onTouchEnd={onTouchEnd} onTouchStart={onTouchStart}>
          <Grid size={size} tiles={tiles}>
            {overlay}
          </Grid>
        </div>
      </div>
      <VideoControl isVideoEnabled={isVideoEnabled} WIDTH={320} HEIGHT={240} onDirectionChange={updateState} />
    </>
  );
};
