import { useEffect, useRef } from 'react';

/**
 * Custom hook to scroll to top of a container when page changes
 * @param page - Current page number
 * @param containerRef - Optional ref to scroll container (defaults to window)
 */
export function useScrollToTopOnPageChange(
  page: number,
  containerRef?: React.RefObject<HTMLElement | null>,
) {
  const prevPageRef = useRef<number | null>(null);

  useEffect(() => {
    // Only scroll if page actually changed (skip initial render)
    if (prevPageRef.current !== null && prevPageRef.current !== page) {
      // Use setTimeout to ensure scroll happens after DOM updates
      setTimeout(() => {
        if (containerRef?.current) {
          // Scroll to the top of the container
          const elementTop = containerRef.current.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({ top: elementTop - 80, behavior: 'smooth' }); // -80 for header offset
        } else {
          // Scroll window to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100); // Small delay to ensure DOM is updated
    }
    prevPageRef.current = page;
  }, [page, containerRef]);
}
