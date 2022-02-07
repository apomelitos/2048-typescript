import { FC, useCallback, useEffect, useReducer } from 'react';
import { TileMeta } from '../types';
import { Grid } from './Grid';
import { Tile } from './Tile';
import { gameReducer } from './GameReducer';

const ROWS = 4;
const COLS = 4;
const TILE_TOTAL_WIDTH = 100;
const BOARD_PADDING = 10;
const CONTAINER_WIDTH = TILE_TOTAL_WIDTH * COLS;
const BOARD_WIDTH = CONTAINER_WIDTH + BOARD_PADDING * 2;

const initialState: TileMeta[] = [
  {
    id: 2,
    value: 2,
    position: [1, 1],
  },
  {
    id: 3,
    value: 2,
    position: [1, 3],
  },
  {
    id: 6,
    value: 2,
    position: [1, 2],
  },
];

const getTilesByCol = (matrix: TileMeta[][], colIdx: number): TileMeta[] => {
  return matrix.map((row) => row[colIdx]).filter((tile) => tile !== undefined);
};

const getEmptyMatrixCells = (matrix: TileMeta[][]): [number, number][] => {
  const emptyCells: [number, number][] = [];

  for (let rowIdx = 0; rowIdx < ROWS; rowIdx++) {
    for (let colIdx = 0; colIdx < COLS; colIdx++) {
      if (matrix[rowIdx][colIdx] === undefined) {
        emptyCells.push([rowIdx, colIdx]);
      }
    }
  }

  console.log(emptyCells);

  return emptyCells;
};

const getTilesMatrix = (...tiles: TileMeta[]): TileMeta[][] => {
  const matrix: TileMeta[][] = [];

  for (let row = 0; row < ROWS; row++) {
    matrix[row] = [];
  }

  for (const tile of tiles) {
    const [row, col] = tile.position;
    matrix[row][col] = tile;
  }

  return matrix;
};

export const Game: FC = (): JSX.Element => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const updateTile = (tile: TileMeta, position: [number, number]) => {
    dispatch({
      type: 'UPDATE',
      payload: {
        tile: { ...tile, position },
      },
    });
  };

  const createTile = useCallback(() => {
    const matrix = getTilesMatrix(...state);
    const emptyCells = getEmptyMatrixCells(matrix);

    if (emptyCells.length === 0) console.log('GAME OVER');

    dispatch({
      type: 'CREATE',
      payload: {
        tile: {
          id: Date.now(),
          value: 2,
          position: emptyCells[Math.floor(Math.random() * emptyCells.length)],
        },
      },
    });
  }, [state]);

  const mergeTile = (source: TileMeta, destination: TileMeta) => {
    setTimeout(() => dispatch({ type: 'MERGE', payload: { source, destination } }), 300);
  };

  const moveLeft = useCallback((): void => {
    const matrix = getTilesMatrix(...state);
    let stateChanges = 0;

    for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
      let currentCol = 0;
      let prevTile: TileMeta | null = null;

      const tilesInRow = matrix[rowIdx].filter((tile) => tile !== undefined);

      for (let colIdx = 0; colIdx < tilesInRow.length; colIdx++) {
        const tile = tilesInRow[colIdx];

        if (prevTile && prevTile.value === tile.value) {
          updateTile(tile, [rowIdx, currentCol - 1]);
          mergeTile(tile, prevTile);
          prevTile = null;
          stateChanges++;
        } else {
          if (tile.position !== [rowIdx, currentCol]) {
            updateTile(tile, [rowIdx, currentCol]);
            stateChanges++;
          }
          prevTile = tile;
          currentCol++;
        }
      }
    }

    if (stateChanges) {
      // createTile();
      console.log(stateChanges);
    }

    console.log('Moved Left');
  }, [state]);

  useEffect(() => {
    const moveRight = (): void => {
      const matrix = getTilesMatrix(...state);

      for (let rowIdx = 0; rowIdx < matrix.length; rowIdx++) {
        let currentCol = COLS - 1;
        const tilesInRow = matrix[rowIdx].filter((tile) => tile !== undefined);

        for (let colIdx = tilesInRow.length - 1; colIdx >= 0; colIdx--) {
          const tile = tilesInRow[colIdx];
          updateTile(tile, [rowIdx, currentCol]);

          if (colIdx && tilesInRow[colIdx + 1]?.value === tile.value) {
            mergeTile(tile, tilesInRow[colIdx + 1]);
          }
          currentCol--;
        }
      }
      console.log('Moved Right');
    };
    const moveUp = (): void => {
      const matrix = getTilesMatrix(...state);

      for (let colIdx = 0; colIdx < COLS; colIdx++) {
        let currentRow = 0;
        const tilesInCol = getTilesByCol(matrix, colIdx);
        console.log(tilesInCol);

        for (let rowIdx = 0; rowIdx < tilesInCol.length; rowIdx++) {
          const tile = tilesInCol[rowIdx];
          updateTile(tile, [currentRow, colIdx]);

          if (colIdx && tilesInCol[rowIdx - 1]?.value === tile.value) {
            mergeTile(tile, tilesInCol[rowIdx - 1]);
          }
          currentRow++;
        }
      }
      console.log('Moved Up');
    };
    const moveDown = (): void => {
      const matrix = getTilesMatrix(...state);

      for (let colIdx = 0; colIdx < COLS; colIdx++) {
        let currentRow = ROWS - 1;
        const tilesInCol = getTilesByCol(matrix, colIdx);

        for (let rowIdx = tilesInCol.length - 1; rowIdx >= 0; rowIdx--) {
          const tile = tilesInCol[rowIdx];
          updateTile(tile, [currentRow, colIdx]);

          if (colIdx && tilesInCol[rowIdx + 1]?.value === tile.value) {
            mergeTile(tile, tilesInCol[rowIdx + 1]);
          }
          currentRow--;
        }
      }

      console.log('Moved Down');
    };

    const onKeyDownHandler = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          moveLeft();
          break;
        case 'ArrowRight':
          moveRight();
          break;
        case 'ArrowUp':
          moveUp();
          break;
        case 'ArrowDown':
          moveDown();
      }
    };

    window.addEventListener('keydown', onKeyDownHandler);

    return () => window.removeEventListener('keydown', onKeyDownHandler);
  }, [moveLeft, state]);

  return (
    <div className='board' style={{ width: BOARD_WIDTH, position: 'relative' }}>
      <Grid cols={COLS} rows={ROWS} />
      {state.map((tile) => (
        <Tile key={tile.id} value={tile.value} position={tile.position} />
      ))}
    </div>
  );
};
