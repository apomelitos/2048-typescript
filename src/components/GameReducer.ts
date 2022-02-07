import { TileMeta } from '../types';

type ReducerAction =
  | {
      type: 'CREATE' | 'UPDATE';
      payload: {
        tile: TileMeta;
      };
    }
  | {
      type: 'MERGE';
      payload: {
        source: TileMeta;
        destination: TileMeta;
      };
    };

export const gameReducer = (tiles: TileMeta[], action: ReducerAction) => {
  switch (action.type) {
    case 'CREATE':
      return [...tiles, action.payload.tile] as TileMeta[];

    case 'UPDATE':
      return [...tiles.filter((tile) => tile.id !== action.payload.tile.id), action.payload.tile] as TileMeta[];

    case 'MERGE':
      return [
        ...tiles.reduce((acc: TileMeta[], tile) => {
          if (tile.id !== action.payload.destination.id) {
            acc.push(tile);
          } else if (action.payload.source.id === tile.id) {
            acc.push({
              ...tile,
              value: tile.value * 2,
            });
          }

          return acc;
        }, []),
      ] as TileMeta[];

    default:
      return tiles;
  }
};
