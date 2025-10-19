import React, { useState, useEffect, useMemo } from "react";
import { useFiltersStore } from "@/app/providers/store/ZustandStore";
import { useTranslation } from "react-i18next";
import { useListings } from "@/hooks/useListings";

export const Filters: React.FC = () => {
  const { t } = useTranslation();
  const { city, minPrice, maxPrice, minRating, sort, setFilters } =
    useFiltersStore();

  const { data } = useListings({});
  const listings = useMemo(
    () => data?.pages.flatMap((page) => page.items) || [],
    [data]
  );

  const cities = useMemo(
    () => Array.from(new Set(listings.map((listing) => listing.city))).sort(),
    [listings]
  );

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

  const handleNumberChange = (
    field: "minPrice" | "maxPrice" | "minRating",
    value: string
  ) => {
    const numValue = value === "" ? 0 : Number(value);
    setLocal({ ...local, [field]: numValue });
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="space-y-4">
        <div className="lg:hidden">
          <h3 className="font-semibold text-lg text-gray-900">
            {t("filters")}
          </h3>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            {t("city")}
          </label>
          <select
            value={local.city}
            onChange={(e) => setLocal({ ...local, city: e.target.value })}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t("allCities")}</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            {t("sortBy")}
          </label>
          <select
            value={local.sort}
            onChange={(e) => setLocal({ ...local, sort: e.target.value })}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="price_asc">{t("priceLowToHigh")}</option>
            <option value="price_desc">{t("priceHighToLow")}</option>
            <option value="rating_desc">{t("ratingHighToLow")}</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("minPrice")}
            </label>
            <input
              type="number"
              value={local.minPrice || ""}
              onChange={(e) => handleNumberChange("minPrice", e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              min="0"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">
              {t("maxPrice")}
            </label>
            <input
              type="number"
              value={local.maxPrice || ""}
              onChange={(e) => handleNumberChange("maxPrice", e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="9999"
              min="0"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700">
            {t("minRating")}
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={local.minRating || ""}
            onChange={(e) => handleNumberChange("minRating", e.target.value)}
            className="w-full mt-1 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="0"
          />
        </div>

        <div className="flex gap-2 pt-2">
          <button
            onClick={apply}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
          >
            {t("apply")}
          </button>
          <button
            onClick={reset}
            className="flex-1 px-4 py-2 border border-red-600 text-red-600 rounded hover:bg-red-50 transition-colors font-medium"
          >
            {t("reset")}
          </button>
        </div>
      </div>
    </div>
  );
};
