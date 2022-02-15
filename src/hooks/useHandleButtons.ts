import { useEffect, MutableRefObject } from 'react';
import { Direction } from '../types';

export const useHandleButtons = (
  updateState: (direction: Direction) => void,
  isMovingRef: MutableRefObject<boolean>
) => {
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
  }, [updateState, isMovingRef]);
};
