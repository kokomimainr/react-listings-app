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

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

interface FavoritesState {
  favorites: string[];
  setFavorites: (favorites: string[]) => void;
  toggleFavorite: (id: string) => void;
  clearFavorites: () => void;
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

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (token) => set({ token }),
      logout: () => set({ token: null }),
    }),
    { name: "auth-storage" }
  )
);

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      
      setFavorites: (favorites) => set({ favorites }),
      
      toggleFavorite: (id: string) => {
        const { favorites } = get();
        const exists = favorites.includes(id);
        const newFavorites = exists
          ? favorites.filter((f) => f !== id)
          : [...favorites, id];
        
        set({ favorites: newFavorites });
      },
      
      clearFavorites: () => set({ favorites: [] }),
    }),
    { 
      name: "favorites-storage",
    }
  )
);