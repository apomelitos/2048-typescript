import React, { SetStateAction, useEffect } from 'react';
import { TileMeta } from '../types';

const SIZE = 4;
const getTilesMatrix = (tiles: TileMeta[]): TileMeta[][] => {
  const matrix: TileMeta[][] = [];

  for (let row = 0; row < SIZE; row++) {
    matrix[row] = [];
  }

  for (const tile of tiles) {
    const [row, col] = tile.position;
    matrix[row][col] = tile;
  }

  return matrix;
};

const isTile = (obj: unknown): obj is TileMeta => !!obj && typeof obj === 'object' && 'position' in obj;

const updateState = (state: TileMeta[], direction: string): TileMeta[] => {
  const matrix = getTilesMatrix(state);
  const newState: TileMeta[] = [];

  const getTileFromCol = (row: number, col: number): TileMeta => matrix[row][col];
  const getTileFromRow = (col: number, row: number): TileMeta => matrix[row][col];
  const getNextPositionInCol = (pointer: number, idx: number): [number, number] => [pointer, idx];
  const getNextPositionInRow = (pointer: number, idx: number): [number, number] => [idx, pointer];

  let getTile = getTileFromRow;
  let getNextPosition = getNextPositionInRow;
  let pointerStart = 0;
  let firstIdx = 0;

  if (direction === 'up' || direction === 'down') {
    getTile = getTileFromCol;
    getNextPosition = getNextPositionInCol;
  }

  if (direction === 'down' || direction === 'right') {
    pointerStart = SIZE - 1;
  }
  if (direction === 'right') {
    firstIdx = SIZE - 1;
  }

  const pointerStep = pointerStart > 0 ? -1 : 1;
  const firstIdxStep = firstIdx > 0 ? -1 : 1;

  for (; firstIdx < SIZE && firstIdx >= 0; firstIdx += firstIdxStep) {
    let pointer = pointerStart;
    for (let secondIdx = pointer; secondIdx >= 0 && secondIdx < SIZE; secondIdx += pointerStep) {
      const tile = getTile(secondIdx, firstIdx);

      if (isTile(tile)) {
        const nextPosition = getNextPosition(pointer, firstIdx);
        newState.push({ ...tile, position: nextPosition });
        pointer += pointerStep;
      }
    }
  }

  return newState;
};

export const useHandleButtons = (setState: React.Dispatch<SetStateAction<TileMeta[]>>) => {
  useEffect(() => {
    const handleKeyPressed = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setState((prev) => updateState(prev, 'left'));
          break;
        case 'ArrowRight':
          setState((prev) => updateState(prev, 'right'));
          break;
        case 'ArrowUp':
          setState((prev) => updateState(prev, 'up'));
          break;
        case 'ArrowDown':
          setState((prev) => updateState(prev, 'down'));
      }
    };

    window.addEventListener('keydown', handleKeyPressed);

    return () => window.removeEventListener('keydown', handleKeyPressed);
  }, [setState]);
};
