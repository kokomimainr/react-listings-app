import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookingsApi } from "@/shared/api";
import type { BookingRequest } from "@/shared/types";

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (booking: BookingRequest) => bookingsApi.create(booking),
    
    // ОПТИМИСТИЧНЫЙ АПДЕЙТ для бронирования
    onMutate: async (booking: BookingRequest) => {
      // Отменяем исходящие запросы
      await queryClient.cancelQueries({ queryKey: ["listing", booking.listingId] });
      
      // Сохраняем предыдущее состояние листинга
      const previousListing = queryClient.getQueryData(["listing", booking.listingId]);
      
      // Оптимистично увеличиваем bookingsCount
      queryClient.setQueryData(["listing", booking.listingId], (old: any) => {
        if (!old) return old;
        
        return {
          ...old,
          bookingsCount: (old.bookingsCount || 0) + 1
        };
      });
      
      // Возвращаем контекст для отката
      return { previousListing, booking };
    },
    
    // При ошибке - ОТКАТ
    onError: (err, booking, context) => {
      console.error("Booking failed:", err);
      
      // Возвращаем предыдущее состояние листинга
      if (context?.previousListing) {
        queryClient.setQueryData(
          ["listing", context.booking.listingId], 
          context.previousListing
        );
      }
    },
    
    // При успехе - инвалидируем кэш листинга
    onSuccess: (data, booking) => {
      queryClient.invalidateQueries({ queryKey: ["listing", booking.listingId] });
    },
    
    // В любом случае - убираем блокировку
    onSettled: (data, error, booking) => {
      queryClient.invalidateQueries({ queryKey: ["listing", booking.listingId] });
    },
  });
};