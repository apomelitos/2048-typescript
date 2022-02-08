import { useEffect } from 'react';

export const useHandleButtons = () => {
  useEffect(() => {
    const moveLeft = () => console.log('Left');
    const moveRight = () => console.log('Right');
    const moveUp = () => console.log('Up');
    const moveDown = () => console.log('Down');

    const handleKeyPressed = (e: KeyboardEvent) => {
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

    window.addEventListener('keydown', handleKeyPressed);

    return () => {
      window.removeEventListener('keydown', handleKeyPressed);
    };
  }, []);
};
