import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/api";
import { useFavoritesStore } from "@/app/providers/store/ZustandStore";

// Хук для загрузки избранных при логине
export const useLoadFavorites = () => {
  const setFavorites = useFavoritesStore((state) => state.setFavorites);
  
  return useMutation({
    mutationFn: async () => {
      const response = await api.get<string[]>("/me/favorites");
      return response.data;
    },
    onSuccess: (favorites) => {
      // Сохраняем в Zustand + localStorage
      setFavorites(favorites);
    },
  });
};

// Хук для переключения избранного с оптимистичным апдейтом
export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { favorites, toggleFavorite: toggleInZustand } = useFavoritesStore();
  
  return useMutation({
    mutationFn: async (listingId: string) => {
      const response = await api.post<{ isFavorite: boolean }>(`/me/favorites/${listingId}/toggle`);
      return { listingId, isFavorite: response.data.isFavorite };
    },
    
    // ОПТИМИСТИЧНЫЙ АПДЕЙТ в Zustand
    onMutate: async (listingId: string) => {
      // Оптимистично обновляем Zustand (и localStorage)
      toggleInZustand(listingId);
      
      // Возвращаем предыдущее состояние для отката
      const previousFavorites = [...favorites];
      return { previousFavorites };
    },
    
    // При ошибке - ОТКАТ в Zustand
    onError: (err, listingId, context) => {
      console.error("Toggle favorite failed:", err);
      // Возвращаем предыдущее состояние в Zustand
      if (context?.previousFavorites) {
        useFavoritesStore.getState().setFavorites(context.previousFavorites);
      }
    },
    
    // При успехе - убеждаемся что Zustand в актуальном состоянии
    onSuccess: (data) => {
      // Можно дополнительно синхронизировать если нужно
      const currentFavorites = useFavoritesStore.getState().favorites;
      const shouldBeFavorite = data.isFavorite;
      const isCurrentlyFavorite = currentFavorites.includes(data.listingId);
      
      // Если есть расхождение - исправляем
      if (shouldBeFavorite !== isCurrentlyFavorite) {
        useFavoritesStore.getState().toggleFavorite(data.listingId);
      }
    },
  });
};