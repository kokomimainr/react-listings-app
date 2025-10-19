import React, { useEffect, useRef, useCallback } from "react";
import { useListings } from "../hooks/useListings";
import { ListingCard } from "../components/ListingCard";
import { Filters } from "../components/Filters";
import {
  useFiltersStore,
  useAuthStore,
} from "@/app/providers/store/ZustandStore";
import { attachAuth } from "../shared/api";

export const ListingsPage: React.FC = () => {
  const { city, minPrice, maxPrice, minRating, sort } = useFiltersStore();
  const token = useAuthStore((s) => s.token);

  useEffect(() => {
    attachAuth(token);
  }, [token]);

  const params = {
    city: city || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    minRating: minRating || undefined,
    sort,
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useListings(params);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (!node) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });
      observerRef.current.observe(node);
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );

  if (isError)
    return (
      <div className="p-8">
        <div className="mb-4">Failed to load listings.</div>
        <button onClick={() => refetch()} className="px-3 py-2 border rounded">
          Retry
        </button>
      </div>
    );

  const pages = data?.pages ?? [];
  const items = pages.flatMap((p) => p.items);

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="lg:col-span-1">
          <Filters />
        </aside>

        <main className="lg:col-span-3">
          {items.length === 0 ? (
            <div className="p-8 bg-white rounded-lg shadow text-center">
              <div className="text-gray-500 mb-2">No listings found</div>
              <div className="text-sm text-gray-400">
                Try adjusting your filters
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((item) => (
                  <ListingCard key={item.id} item={item} />
                ))}
              </div>

              {isFetchingNextPage && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-gray-600">
                    Loading more listings...
                  </span>
                </div>
              )}

              <div ref={loadMoreRef as any} className="mt-6 text-center">
                {hasNextPage && !isFetchingNextPage && (
                  <div className="text-gray-500 text-sm py-4">
                    Scroll down to load more
                  </div>
                )}
                {!hasNextPage && items.length > 0 && (
                  <div className="text-gray-400 text-sm py-4 border-t">
                    — You've reached the end —
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
