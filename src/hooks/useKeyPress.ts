import { useEffect } from 'react';

export const useKeyPress = (key: string, action: () => void) => {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => e.key === key && action();

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, action]);
};
