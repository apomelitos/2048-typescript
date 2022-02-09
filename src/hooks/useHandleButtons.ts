import React, { SetStateAction, useEffect } from 'react';
import { TileMeta } from '../types';

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
  let changesCount = 0;

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

      if (tile !== undefined) {
        let { value } = tile;

        if (prevTile !== undefined && prevTile.value === value) {
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

        if (position[0] !== tile.position[0] || position[1] !== tile.position[1]) {
          changesCount++;
        }
      }
    }
  }

  const mergedState = newState.filter((tile) => !toDeleteTilesIDs.includes(tile.id));

  if (changesCount > 0) {
    const newTile = generateRandomTile(mergedState);
    return [...mergedState, newTile];
  }

  return mergedState;
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
