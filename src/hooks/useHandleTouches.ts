import React, { useState } from 'react';
import { Direction } from '../types';

type Coords = {
  clientX: number;
  clientY: number;
};

const MIN_DISTANCE = 50;

const getSwipeDirection = (startCoords: Coords, endCoords: Coords): Direction | undefined => {
  const absX = Math.abs(startCoords.clientX - endCoords.clientX);
  const absY = Math.abs(startCoords.clientY - endCoords.clientY);

  if (absX > absY && absX > MIN_DISTANCE) {
    return startCoords.clientX > endCoords.clientX ? 'LEFT' : 'RIGHT';
  } else if (absY > MIN_DISTANCE) {
    return startCoords.clientY > endCoords.clientY ? 'UP' : 'DOWN';
  }

  return undefined;
};

export const useHandleTouches = (onSwipe: (direction: Direction) => void) => {
  const [startCoords, setStartCoords] = useState<Coords | null>(null);

  const processSwipe = (endCoords: Coords) => {
    if (!startCoords) return;

    const direction = getSwipeDirection(startCoords, endCoords);

    if (direction) onSwipe(direction);

    setStartCoords(null);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.touches[0];
    setStartCoords({ clientX, clientY });
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const { clientX, clientY } = e.changedTouches[0];
    processSwipe({ clientX, clientY });
  };

  return [onTouchStart, onTouchEnd];
};
