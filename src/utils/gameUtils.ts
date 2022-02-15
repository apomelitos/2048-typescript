import { TileMeta, Direction } from '../types';

type Position = [number, number];

type MoveStateReturn = [TileMeta[], [TileMeta, TileMeta][], number];

const getTilesMatrix = (size: number, tiles: TileMeta[]): TileMeta[][] => {
  const matrix: TileMeta[][] = Array<TileMeta[]>(size)
    .fill([])
    .map(() => Array<TileMeta>(size));

  for (const tile of tiles) {
    const [row, col] = tile.position;
    matrix[row][col] = tile;
  }

  return matrix;
};

export const getScoreFromMergePairs = (mergePairs: [TileMeta, TileMeta][]): number => {
  return mergePairs.reduce((acc, item) => (acc || 0) + item[0].value, 0);
};

export const mergeState = (state: TileMeta[], mergePairs: [TileMeta, TileMeta][]): TileMeta[] => {
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

export const hasPossibleMoves = (size: number, tiles: TileMeta[]): boolean => {
  const matrix = getTilesMatrix(size, tiles);

  if (tiles.length < size * size) return true;

  for (let row = 0; row < size - 1; row++) {
    for (let col = 0; col < size; col++) {
      if (
        matrix[row][col].value === matrix[row][col + 1]?.value ||
        matrix[row][col].value === matrix[row + 1][col].value
      ) {
        return true;
      }
    }
  }

  return false;
};

export const generateRandomTile = (size: number, tiles: TileMeta[]) => {
  const matrix = getTilesMatrix(size, tiles);
  const emptyCellsPositions: Position[] = [];

  for (let rowIdx = 0; rowIdx < size; rowIdx++) {
    for (let colIdx = 0; colIdx < size; colIdx++) {
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
    isMerged: false,
  };
};

export const moveState = (size: number, state: TileMeta[], direction: Direction): MoveStateReturn => {
  const matrix = getTilesMatrix(size, state);
  const movedState: TileMeta[] = [];
  let changesCount = 0;
  const mergePairs: [TileMeta, TileMeta][] = [];

  const fromEndToStart = [size - 1, -1];
  const fromStartToEnd = [0, 1];

  const [pointerStart, pointerStep] = direction === 'DOWN' || direction === 'RIGHT' ? fromEndToStart : fromStartToEnd;

  const isHorisontalDirection = direction === 'LEFT' || direction === 'RIGHT';

  const getTile = ([row, col]: Position) => (isHorisontalDirection ? matrix[col][row] : matrix[row][col]);

  const getNextPosition = (pointer: number, rowOrCol: number): Position =>
    isHorisontalDirection ? [rowOrCol, pointer] : [pointer, rowOrCol];

  for (let firstIdx = 0; firstIdx < size; firstIdx++) {
    let pointer = pointerStart;
    let prevTile: TileMeta | undefined;

    for (let secondIdx = pointerStart; secondIdx >= 0 && secondIdx < size; secondIdx += pointerStep) {
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
