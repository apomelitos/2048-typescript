import React, { useEffect, useCallback, useRef } from 'react';
import { TileMeta } from '../types';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type Position = [number, number];

type MoveStateReturn = [TileMeta[], [TileMeta, TileMeta][], number];

const SIZE = 4;

const hasPossibleMoves = (tiles: TileMeta[]): boolean => {
  const matrix = getTilesMatrix(tiles);

  if (tiles.length < SIZE * SIZE) return true;

  for (let row = 0; row < SIZE - 1; row++) {
    for (let col = 0; col < SIZE - 1; col++) {
      if (
        matrix[row][col].value === matrix[row][col + 1].value ||
        matrix[row][col].value === matrix[row + 1][col].value
      )
        return true;
    }
  }

  return false;
};

const getScoreFromMergePairs = (mergePairs: [TileMeta, TileMeta][]): number => {
  return mergePairs.reduce((acc, item) => (acc || 0) + item[0].value, 0);
};

const getTilesMatrix = (tiles: TileMeta[]): TileMeta[][] => {
  const matrix: TileMeta[][] = Array<TileMeta[]>(SIZE)
    .fill([])
    .map(() => Array<TileMeta>(SIZE));

  for (const tile of tiles) {
    const [row, col] = tile.position;
    matrix[row][col] = tile;
  }

  return matrix;
};

const generateRandomTile = (tiles: TileMeta[]) => {
  const matrix = getTilesMatrix(tiles);
  const emptyCellsPositions: Position[] = [];

  for (let rowIdx = 0; rowIdx < SIZE; rowIdx++) {
    for (let colIdx = 0; colIdx < SIZE; colIdx++) {
      if (matrix[rowIdx][colIdx] === undefined) {
        emptyCellsPositions.push([rowIdx, colIdx]);
      }
    }
  }

  const position = emptyCellsPositions[Math.floor(Math.random() * emptyCellsPositions.length)];

  return {
    id: Math.random(),
    value: 2,
    position,
    isNew: true,
  };
};

const moveState = (state: TileMeta[], direction: Direction): MoveStateReturn => {
  const matrix = getTilesMatrix(state);
  const movedState: TileMeta[] = [];
  let changesCount = 0;
  const mergePairs: [TileMeta, TileMeta][] = [];

  const fromEndToStart = [SIZE - 1, -1];
  const fromStartToEnd = [0, 1];

  const [pointerStart, pointerStep] = direction === 'DOWN' || direction === 'RIGHT' ? fromEndToStart : fromStartToEnd;

  const isHorisontalDirection = direction === 'LEFT' || direction === 'RIGHT';

  const getTile = ([row, col]: Position) => (isHorisontalDirection ? matrix[col][row] : matrix[row][col]);

  const getNextPosition = (pointer: number, rowOrCol: number): Position =>
    isHorisontalDirection ? [rowOrCol, pointer] : [pointer, rowOrCol];

  for (let firstIdx = 0; firstIdx < SIZE; firstIdx++) {
    let pointer = pointerStart;
    let prevTile: TileMeta | undefined;

    for (let secondIdx = pointerStart; secondIdx >= 0 && secondIdx < SIZE; secondIdx += pointerStep) {
      const tile = getTile([secondIdx, firstIdx]);

      if (tile !== undefined) {
        let position = getNextPosition(pointer, firstIdx);
        // Move with merge
        if (prevTile !== undefined && prevTile.value === tile.value) {
          position = getNextPosition(pointer - pointerStep, firstIdx);
          mergePairs.push([{ ...tile, position }, prevTile]);
          movedState.push({ ...tile, position });
          prevTile = undefined;
          // Move without merge
        } else {
          prevTile = { ...tile, position };
          movedState.push(prevTile);
          pointer += pointerStep;
        }

        if (tile.position[0] !== position[0] || tile.position[1] !== position[1]) {
          changesCount++;
        }
      }
    }
  }

  return [movedState, mergePairs, changesCount];
};

const mergeState = (state: TileMeta[], mergePairs: [TileMeta, TileMeta][]): TileMeta[] => {
  const mergedState = [...state];
  const toDeleteTilesIDs: number[] = [];

  for (const [source, destination] of mergePairs) {
    const sourceIdx = mergedState.findIndex((tile) => tile.id === source.id);
    mergedState[sourceIdx] = {
      id: Math.random(),
      value: source.value * 2,
      position: destination.position,
      isMerged: true,
    };
    toDeleteTilesIDs.push(destination.id, source.id);
  }

  return mergedState.filter((tile) => !toDeleteTilesIDs.includes(tile.id));
};

export const useHandleButtons = (
  setState: React.Dispatch<React.SetStateAction<TileMeta[]>>,
  setScore: React.Dispatch<React.SetStateAction<number>>,
  setPrevState: React.Dispatch<React.SetStateAction<TileMeta[] | null>>,
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const isMovingRef = useRef(false);

  const updateState = useCallback(
    (direction: Direction) => {
      isMovingRef.current = true;

      let movedState: TileMeta[];
      let mergePairs: [TileMeta, TileMeta][];
      let changesCount = 0;

      setState((prev) => {
        if (changesCount > 0) setPrevState(prev);

        [movedState, mergePairs, changesCount] = moveState(prev, direction);

        return movedState;
      });

      setTimeout(() => {
        let currentState;

        setState((prev) => {
          currentState = mergeState(prev, mergePairs);
          return currentState;
        });

        if (changesCount > 0) {
          setScore((prev) => prev + getScoreFromMergePairs(mergePairs));
          setState((prev) => {
            currentState = [...prev, generateRandomTile(prev)];
            if (!hasPossibleMoves(currentState)) setIsGameOver(true);
            return currentState;
          });
        }

        isMovingRef.current = false;
      }, 300); // Should be the same as in CSS
    },
    [setState, setScore, setPrevState, setIsGameOver]
  );

  useEffect(() => {
    const handleKeyPressed = (e: KeyboardEvent) => {
      if (isMovingRef.current) return;

      switch (e.key) {
        case 'ArrowLeft':
          updateState('LEFT');
          break;
        case 'ArrowRight':
          updateState('RIGHT');
          break;
        case 'ArrowUp':
          updateState('UP');
          break;
        case 'ArrowDown':
          updateState('DOWN');
      }
    };

    window.addEventListener('keydown', handleKeyPressed);

    return () => window.removeEventListener('keydown', handleKeyPressed);
  }, [updateState]);
};
