import { useEffect } from "react";
import { useAuthStore, useFavoritesStore } from "@/app/providers/store/ZustandStore";
import { useLoadFavorites } from "@/hooks/useFavorites";

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = useAuthStore((state) => state.token);
  const favorites = useFavoritesStore((state) => state.favorites);
  const { mutate: loadFavorites } = useLoadFavorites();

  useEffect(() => {
    if (token && favorites.length === 0) {
      loadFavorites();
    }
  }, [token, favorites.length, loadFavorites]);

  return <>{children}</>;
};