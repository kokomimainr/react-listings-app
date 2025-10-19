import { useQuery } from "@tanstack/react-query";
import { listingsApi } from "@/shared/api";

export const useListingDetail = (id: string) => {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => listingsApi.getById(id).then((res) => res.data),
    enabled: !!id,
  });
};
