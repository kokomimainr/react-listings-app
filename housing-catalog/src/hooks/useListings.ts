import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../shared/api";
import type { Listing } from "@/entities/listing/listing";

export type ListingsFetchParams = {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sort?: string;
  page?: number;
  limit?: number;
};

type ListingsResponse = {
  items: Listing[];
  total: number;
  page: number;
  limit: number;
};

async function fetchListings(
  params: ListingsFetchParams
): Promise<ListingsResponse> {
  const { page = 1, limit = 20, ...rest } = params;
  const res = await api.get<Listing[]>("/listings", {
    params: { ...rest, page, limit },
  });

  const total = Number(res.headers["x-total-count"] ?? 0);
  return { items: res.data, total, page, limit };
}

export function useListings(
  params: Omit<ListingsFetchParams, "page">,
  enabled = true
) {
  return useInfiniteQuery({
    queryKey: ["listings", params] as const,
    queryFn: ({ pageParam = 1 }) => {
      return fetchListings({ ...params, page: pageParam });
    },
    enabled,
    getNextPageParam: (lastPage) => {
      return lastPage.items.length === 20 ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}
