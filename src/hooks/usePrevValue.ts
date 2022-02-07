import { useRef, useEffect } from 'react';

export const usePrevValue = (value: number) => {
  const ref = useRef<number>();

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
};
