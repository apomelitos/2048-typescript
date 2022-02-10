import { useEffect, useCallback } from 'react';
import { TileMeta } from '../types';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

type Position = [number, number];

type MoveOptions = {
  pointerStart: number;
  firstIdxStart: number;
  getTile: (matrix: TileMeta[][], secondIdx: number, firstIdx: number) => TileMeta;
  getNextPosition: (pointer: number, idx: number) => Position;
};

type MoveStateReturn = [TileMeta[], [TileMeta, TileMeta][], number];

const SIZE = 4;

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
  const emptyCellsPositions: [number, number][] = [];

  for (let rowIdx = 0; rowIdx < SIZE; rowIdx++) {
    for (let colIdx = 0; colIdx < SIZE; colIdx++) {
      if (matrix[rowIdx][colIdx] === undefined) {
        emptyCellsPositions.push([rowIdx, colIdx]);
      }
    }
  }

  const position = emptyCellsPositions[Math.floor(Math.random() * emptyCellsPositions.length)];

  return {
    id: performance.now(),
    value: 2,
    position,
  };
};

const moveState = (state: TileMeta[], options: MoveOptions): MoveStateReturn => {
  const { pointerStart, firstIdxStart, getTile, getNextPosition } = options;
  const matrix = getTilesMatrix(state);
  const movedState: TileMeta[] = [];
  let changesCount = 0;
  const mergePairs: [TileMeta, TileMeta][] = [];

  const pointerStep = pointerStart > 0 ? -1 : 1;
  const firstIdxStep = firstIdxStart > 0 ? -1 : 1;

  for (let firstIdx = firstIdxStart; firstIdx < SIZE && firstIdx >= 0; firstIdx += firstIdxStep) {
    let pointer = pointerStart;
    let prevTile: TileMeta | undefined;
    for (let secondIdx = pointer; secondIdx >= 0 && secondIdx < SIZE; secondIdx += pointerStep) {
      const tile = getTile(matrix, secondIdx, firstIdx);

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
    mergedState[sourceIdx] = { ...source, value: source.value * 2, position: destination.position };
    toDeleteTilesIDs.push(destination.id);
  }

  return mergedState.filter((tile) => !toDeleteTilesIDs.includes(tile.id));
};

export const useHandleButtons = (setState: React.Dispatch<React.SetStateAction<TileMeta[]>>) => {
  const updateState = useCallback(
    (direction: Direction) => {
      let movedState: TileMeta[] = [];
      let mergePairs: [TileMeta, TileMeta][] = [];
      let changesCount = 0;
      const options: Partial<MoveOptions> = {};

      const getTileFromCol = (matrix: TileMeta[][], row: number, col: number): TileMeta => matrix[row][col];
      const getTileFromRow = (matrix: TileMeta[][], col: number, row: number): TileMeta => matrix[row][col];
      const getNextPositionInCol = (pointer: number, idx: number): Position => [pointer, idx];
      const getNextPositionInRow = (pointer: number, idx: number): Position => [idx, pointer];

      if (direction === 'UP' || direction === 'DOWN') {
        options.getTile = getTileFromCol;
        options.getNextPosition = getNextPositionInCol;
      } else {
        options.getTile = getTileFromRow;
        options.getNextPosition = getNextPositionInRow;
      }

      options.pointerStart = direction === 'DOWN' || direction === 'RIGHT' ? SIZE - 1 : 0;
      options.firstIdxStart = direction === 'RIGHT' ? SIZE - 1 : 0;

      setState((prev) => {
        [movedState, mergePairs, changesCount] = moveState(prev, options as Required<MoveOptions>);
        return movedState;
      });

      setTimeout(() => setState((prev) => mergeState(prev, mergePairs)), 300);

      if (changesCount > 0) {
        setState((prev) => [...prev, generateRandomTile(prev)]);
      }
    },
    [setState]
  );

  useEffect(() => {
    const handleKeyPressed = (e: KeyboardEvent) => {
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
