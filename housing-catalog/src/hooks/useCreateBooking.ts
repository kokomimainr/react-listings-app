import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/shared/api";
import type { BookingRequest } from "@/shared/types";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (booking: BookingRequest) => bookingsApi.create(booking),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["listing", variables.listingId] });
    },
  });
};