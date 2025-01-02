import { useEffect, useRef } from 'react';

interface TVNavigationOptions {
  grid?: boolean;
  gridColumns?: number;
  onSelect?: (element: HTMLElement) => void;
}

const useTVNavigation = (options: TVNavigationOptions = {}) => {
  const { grid = false, gridColumns = 1, onSelect } = options;
  const elementsRef = useRef<Map<number, HTMLElement>>(new Map());
  const focusedIndexRef = useRef<number>(-1);

  const registerElement = (element: HTMLElement | null, index: number) => {
    if (element) {
      elementsRef.current.set(index, element);
    } else {
      elementsRef.current.delete(index);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const elements = Array.from(elementsRef.current.entries()).sort(
        ([a], [b]) => a - b
      );
      if (elements.length === 0) return;

      const currentIndex = focusedIndexRef.current;
      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowUp':
          if (grid) {
            nextIndex = currentIndex - gridColumns;
          } else {
            nextIndex = currentIndex - 1;
          }
          break;
        case 'ArrowDown':
          if (grid) {
            nextIndex = currentIndex + gridColumns;
          } else {
            nextIndex = currentIndex + 1;
          }
          break;
        case 'ArrowLeft':
          if (grid) {
            nextIndex = currentIndex - 1;
          }
          break;
        case 'ArrowRight':
          if (grid) {
            nextIndex = currentIndex + 1;
          }
          break;
        case 'Enter':
          if (currentIndex >= 0) {
            const element = elementsRef.current.get(currentIndex);
            if (element && onSelect) {
              onSelect(element);
            }
          }
          break;
        default:
          return;
      }

      // Find the closest valid index
      const validIndices = elements.map(([index]) => index);
      const closestIndex = validIndices.reduce((prev, curr) => {
        return Math.abs(curr - nextIndex) < Math.abs(prev - nextIndex)
          ? curr
          : prev;
      });

      if (closestIndex !== currentIndex) {
        const element = elementsRef.current.get(closestIndex);
        if (element) {
          // Remove focus from current element
          const currentElement = elementsRef.current.get(currentIndex);
          if (currentElement) {
            currentElement.classList.remove('focused');
          }

          // Add focus to new element
          element.classList.add('focused');
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
          });

          focusedIndexRef.current = closestIndex;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, gridColumns, onSelect]);

  return { registerElement };
};

export { useTVNavigation };
