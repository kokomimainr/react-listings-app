import React, { useState, useEffect } from "react";
import { useFiltersStore } from "@/app/providers/store/ZustandStore";

export const Filters: React.FC = () => {
  const { city, minPrice, maxPrice, minRating, sort, setFilters } =
    useFiltersStore();
  const [local, setLocal] = useState({
    city,
    minPrice,
    maxPrice,
    minRating,
    sort,
  });

  useEffect(
    () => setLocal({ city, minPrice, maxPrice, minRating, sort }),
    [city, minPrice, maxPrice, minRating, sort]
  );

  function apply() {
    setFilters(local);
  }

  function reset() {
    const defaultState = {
      city: "",
      minPrice: 0,
      maxPrice: 9999,
      minRating: 0,
      sort: "price_asc",
    };
    setLocal(defaultState);
    setFilters(defaultState);
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div className="lg:hidden">
          <h3 className="font-semibold text-lg text-gray-900">Filters</h3>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">City</label>
          <input
            value={local.city}
            onChange={(e) => setLocal({ ...local, city: e.target.value })}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">Sort by</label>
          <select
            value={local.sort}
            onChange={(e) => setLocal({ ...local, sort: e.target.value })}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="price_asc">Price — Low to High</option>
            <option value="price_desc">Price — High to Low</option>
            <option value="rating_desc">Rating — High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Min price
            </label>
            <input
              type="number"
              value={local.minPrice}
              onChange={(e) =>
                setLocal({ ...local, minPrice: Number(e.target.value) })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              Max price
            </label>
            <input
              type="number"
              value={local.maxPrice}
              onChange={(e) =>
                setLocal({ ...local, maxPrice: Number(e.target.value) })
              }
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            Min rating
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={local.minRating}
            onChange={(e) =>
              setLocal({ ...local, minRating: Number(e.target.value) })
            }
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={apply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            Apply
          </button>
          <button
            onClick={reset}
            className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors font-medium"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
};
