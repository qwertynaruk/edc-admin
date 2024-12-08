import { useCallback } from 'react';

export default function useDimension() {
  const getResolution = useCallback((orientation) => {
    if (typeof window !== 'undefined') {
      if (orientation === 'width') {
        return window.innerWidth;
      }

      if (orientation === 'height') {
        return window.innerHeight;
      }
    }

    return undefined;
  }, []);

  return {
    width: getResolution('width'),
    height: getResolution('height'),
  };
}
