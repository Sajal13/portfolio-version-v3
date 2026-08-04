'use client';

import {
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { getDeviceInfo } from '@repo/ui/utils';

// Evaluated once at module load time — never changes between renders
const isMobile =
  typeof window !== 'undefined' ? (getDeviceInfo()?.is.mobile ?? false) : false;

export const useGetDndSensor = () => {
  return useSensors(
    useSensor(PointerSensor, {
      activationConstraint: isMobile
        ? { delay: 300, tolerance: 10 }
        : { delay: 300, distance: 0, tolerance: 5 }
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 300, tolerance: 10 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
};
