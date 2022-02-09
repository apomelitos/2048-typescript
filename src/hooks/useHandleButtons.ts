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

const updateState = (state: TileMeta[], direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'): TileMeta[] => {
  const matrix = getTilesMatrix(state);
  const newState: TileMeta[] = [];
  const toDeleteTilesIDs: number[] = [];

  const getTileFromCol = (row: number, col: number): TileMeta => matrix[row][col];
  const getTileFromRow = (col: number, row: number): TileMeta => matrix[row][col];
  const getNextPositionInCol = (pointer: number, idx: number): [number, number] => [pointer, idx];
  const getNextPositionInRow = (pointer: number, idx: number): [number, number] => [idx, pointer];

  let getTile = getTileFromRow;
  let getNextPosition = getNextPositionInRow;
  let pointerStart = 0;
  let firstIdx = 0;

  if (direction === 'UP' || direction === 'DOWN') {
    getTile = getTileFromCol;
    getNextPosition = getNextPositionInCol;
  }

  if (direction === 'DOWN' || direction === 'RIGHT') {
    pointerStart = SIZE - 1;
  }
  if (direction === 'RIGHT') {
    firstIdx = SIZE - 1;
  }

  const pointerStep = pointerStart > 0 ? -1 : 1;
  const firstIdxStep = firstIdx > 0 ? -1 : 1;

  for (; firstIdx < SIZE && firstIdx >= 0; firstIdx += firstIdxStep) {
    let pointer = pointerStart;
    let prevTile: TileMeta | undefined;
    for (let secondIdx = pointer; secondIdx >= 0 && secondIdx < SIZE; secondIdx += pointerStep) {
      const tile = getTile(secondIdx, firstIdx);

      if (isTile(tile)) {
        let { value } = tile;

        if (isTile(prevTile) && prevTile.value === value) {
          pointer -= pointerStep;
          value = value + value;
          toDeleteTilesIDs.push(prevTile.id);
          prevTile = undefined;
        } else {
          prevTile = tile;
        }

        const position = getNextPosition(pointer, firstIdx);
        newState.push({ ...tile, position, value });
        pointer += pointerStep;
      }
    }
  }

  return newState.filter((tile) => !toDeleteTilesIDs.includes(tile.id));
};

export const useHandleButtons = (setState: React.Dispatch<SetStateAction<TileMeta[]>>) => {
  useEffect(() => {
    const handleKeyPressed = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          setState((prev) => updateState(prev, 'LEFT'));
          break;
        case 'ArrowRight':
          setState((prev) => updateState(prev, 'RIGHT'));
          break;
        case 'ArrowUp':
          setState((prev) => updateState(prev, 'UP'));
          break;
        case 'ArrowDown':
          setState((prev) => updateState(prev, 'DOWN'));
      }
    };

    window.addEventListener('keydown', handleKeyPressed);

    return () => window.removeEventListener('keydown', handleKeyPressed);
  }, [setState]);
};
