import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FiltersState {
  city: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sort: string;
  setFilters: (filters: Partial<FiltersState>) => void;
}

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
}

export const useFiltersStore = create<FiltersState>()(
  persist(
    (set) => ({
      city: "",
      minPrice: 0,
      maxPrice: 9999,
      minRating: 0,
      sort: "price_asc",
      setFilters: (filters) => set((state) => ({ ...state, ...filters })),
    }),
    { name: "filters-storage" }
  )
);

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      toggleFavorite: (id) => {
        const exists = get().favorites.includes(id);
        set({
          favorites: exists
            ? get().favorites.filter((f) => f !== id)
            : [...get().favorites, id],
        });
      },
    }),
    { name: "favorites-storage" }
  )
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
    }),
    { name: "auth-storage" }
  )
);
