import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore, useFavoritesStore } from "@/app/providers/store/ZustandStore";

export const useLogout = () => {
  const logout = useAuthStore((state) => state.logout);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return Promise.resolve();
    },
    onSuccess: () => {
      // Очищаем всё
      queryClient.removeQueries();
      clearFavorites(); // Очищаем избранные из Zustand + localStorage
      logout(); // Очищаем токен
    },
  });
};