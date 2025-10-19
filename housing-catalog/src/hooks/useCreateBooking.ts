import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/shared/api";
import type { BookingRequest } from "@/shared/types";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (booking: BookingRequest) => bookingsApi.create(booking),

    onMutate: async (booking: BookingRequest) => {
      await queryClient.cancelQueries({
        queryKey: ["listing", booking.listingId],
      });

      const previousListing = queryClient.getQueryData([
        "listing",
        booking.listingId,
      ]);

      queryClient.setQueryData(["listing", booking.listingId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          bookingsCount: (old.bookingsCount || 0) + 1,
        };
      });

      return { previousListing, booking };
    },

    onError: (err, booking, context) => {
      console.error("Booking failed:", err);

      if (context?.previousListing) {
        queryClient.setQueryData(
          ["listing", context.booking.listingId],
          context.previousListing
        );
      }
    },

    onSuccess: (data, booking) => {
      queryClient.invalidateQueries({
        queryKey: ["listing", booking.listingId],
      });
    },

    onSettled: (data, error, booking) => {
      queryClient.invalidateQueries({
        queryKey: ["listing", booking.listingId],
      });
    },
  });
};
