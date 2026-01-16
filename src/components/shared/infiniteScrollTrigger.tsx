"use client";
import { useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollTriggerProps {
  hasNextPage: boolean | undefined;
  fetchNextPage: () => void;
  isFetchingNextPage: boolean;
}

export default function InfiniteScrollTrigger({
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
}: InfiniteScrollTriggerProps) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px", //* Trigger 100px before the element becomes visible
  });

  const fetchTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    //* Clear any pending fetch timeouts
    if (fetchTimeoutRef.current) {
      clearTimeout(fetchTimeoutRef.current);
    }

    //* If the div is in view and we have more data, fetch it
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchTimeoutRef.current = setTimeout(() => {
        fetchNextPage();
      }, 100);
    }

    return () => {
      if (fetchTimeoutRef.current) {
        clearTimeout(fetchTimeoutRef.current);
      }
    };
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div
      ref={ref}
      className="h-16 w-full flex items-center justify-center p-4"
      role="status"
      aria-label="Loading more content"
    >
      {isFetchingNextPage && (
        <p className="p-4 rounded-full animate-spin border-y border-sky-500" />
      )}
      {!hasNextPage && !isFetchingNextPage && (
        <p className="text-center text-sky-500 py-5 font-semibold">
          No more data
        </p>
      )}
    </div>
  );
}
