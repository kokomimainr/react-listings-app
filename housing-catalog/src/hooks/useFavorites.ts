import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { useFavoritesStore } from "@/app/providers/store/ZustandStore";

export const useLoadFavorites = () => {
  const setFavorites = useFavoritesStore((state) => state.setFavorites);

  return useMutation({
    mutationFn: async () => {
      const response = await api.get<string[]>("/me/favorites");
      return response.data;
    },
    onSuccess: (favorites) => {
      setFavorites(favorites);
    },
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { favorites, toggleFavorite: toggleInZustand } = useFavoritesStore();

  return useMutation({
    mutationFn: async (listingId: string) => {
      const response = await api.post<{ isFavorite: boolean }>(
        `/me/favorites/${listingId}/toggle`
      );
      return { listingId, isFavorite: response.data.isFavorite };
    },

    onMutate: async (listingId: string) => {
      toggleInZustand(listingId);

      const previousFavorites = [...favorites];
      return { previousFavorites };
    },

    onError: (err, listingId, context) => {
      console.error("Toggle favorite failed:", err);
      if (context?.previousFavorites) {
        useFavoritesStore.getState().setFavorites(context.previousFavorites);
      }
    },

    onSuccess: (data) => {
      const currentFavorites = useFavoritesStore.getState().favorites;
      const shouldBeFavorite = data.isFavorite;
      const isCurrentlyFavorite = currentFavorites.includes(data.listingId);

      if (shouldBeFavorite !== isCurrentlyFavorite) {
        useFavoritesStore.getState().toggleFavorite(data.listingId);
      }
    },
  });
};
