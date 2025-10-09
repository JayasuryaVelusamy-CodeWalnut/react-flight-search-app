import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

export const useClickOutside = (
  handler: () => void,
  triggerRef?: RefObject<HTMLElement | null>
) => {
  const domNode = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (triggerRef?.current?.contains(event.target as Node)) {
        return;
      }
      if (domNode.current && !domNode.current.contains(event.target as Node)) {
        handler();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [handler, triggerRef]);

  return domNode;
};
