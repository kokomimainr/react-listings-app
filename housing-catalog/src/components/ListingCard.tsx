import React from "react";
import type { Listing } from "@/shared/types";
import { Link } from "react-router-dom";
import { useFavoritesStore, useAuthStore } from "@/app/providers/ZustandStore";
import { api } from "../shared/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export const ListingCard: React.FC<{ item: Listing }> = ({ item }) => {
  const { favorites, toggleFavorite } = useFavoritesStore();
  const token = useAuthStore((state) => state.token); 
  const isFav = favorites.includes(item.id);

  async function onToggle(e: React.MouseEvent) {
    e.preventDefault();
    if (!token) return; 
    
    toggleFavorite(item.id);
    try {
      await api.post(`/me/favorites/${item.id}/toggle`);
    } catch (err) {
      toggleFavorite(item.id);
      console.error("Toggle favorite failed", err);
    }
  }

  return (
    <Link to={`/listing/${item.id}`} className="block bg-white rounded-lg shadow hover:shadow-md overflow-hidden group">
      <div className="relative h-44 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
        {item.thumbnailUrl ? (
          <img 
            src={item.thumbnailUrl} 
            alt={item.title} 
            className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
        
        {token && (
          <button
            onClick={onToggle}
            className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-all duration-200 shadow-sm"
            aria-pressed={isFav}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          >
            {isFav ? (
              <FaHeart className="text-red-500 w-4 h-4" />
            ) : (
              <FaRegHeart className="text-gray-600 w-4 h-4 hover:text-red-400" />
            )}
          </button>
        )}
      </div>
      
      <div className="p-3">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold truncate">{item.title}</h3>
            <div className="text-xs text-gray-500 mt-1">{item.city}</div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-sm font-medium">${item.pricePerNight}</div>
            <div className="text-xs text-gray-500">/ night</div>
          </div>
        </div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
            <span>★</span>
            <span>{item.rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};