import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useListingDetail } from "@/hooks/useListingDetail";
import {
  useAuthStore,
  useFavoritesStore,
} from "@/app/providers/store/ZustandStore";
import { useToggleFavorite } from "@/hooks/useFavorites";
import { PhotoGallery } from "@/widgets/PhotoGallery/PhotoGallery";
import { BookingForm } from "@/features/booking/BookingForm";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export const ListingDetailPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    data: listing,
    isLoading,
    isError,
    error,
  } = useListingDetail(id || "");
  const token = useAuthStore((state) => state.token);
  const favorites = useFavoritesStore((state) => state.favorites);
  const { mutate: toggleFavorite, isPending } = useToggleFavorite();

  if (!id) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">{t("listingNotFound")}</h2>
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:underline"
          >
            {t("backToListings")}
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center min-h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <h2 className="text-xl font-semibold mb-4">
            {t("failedToLoadListing")}
          </h2>
          <div className="text-gray-600 mb-4">
            {error instanceof Error ? error.message : t("unknownError")}
          </div>
          <div className="space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {t("retry")}
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            >
              {t("backToListings")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) return null;

  const isFav = favorites.includes(listing.id);

  function handleToggleFavorite() {
    if (!token || isPending || !listing) return;
    toggleFavorite(listing.id);
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4 transition-colors"
        >
          <span>←</span>
          <span>{t("backToListings")}</span>
        </button>

        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              {listing.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-gray-600">
              <span className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
                📍 {listing.city}
              </span>
              <span className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full text-sm text-yellow-700">
                ★ {listing.rating.toFixed(1)}
              </span>
              {listing.bookingsCount > 0 && (
                <span className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full text-sm text-green-700">
                  🔥 {t("bookingsCount", { count: listing.bookingsCount })}
                </span>
              )}
            </div>
          </div>

          {token ? (
            <button
              onClick={handleToggleFavorite}
              className="flex-shrink-0 p-3 bg-white border border-gray-300 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              aria-label={
                isFav ? t("removeFromFavorites") : t("addToFavorites")
              }
            >
              {isFav ? (
                <FaHeart className="text-red-500 w-6 h-6" />
              ) : (
                <FaRegHeart className="text-gray-600 w-6 h-6 hover:text-red-400 transition-colors" />
              )}
            </button>
          ) : (
            <div className="flex-shrink-0 text-sm text-gray-500 text-center">
              <div className="p-3 border border-gray-300 rounded-full bg-gray-50">
                <FaRegHeart className="w-6 h-6 mx-auto mb-1 text-gray-400" />
                <span className="text-xs">{t("loginToSave")}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <PhotoGallery photos={listing.photos} title={listing.title} />

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("aboutThisPlace")}
              </h2>
            </div>

            {listing.description ? (
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-lg leading-relaxed mb-4">
                  {listing.description}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-sm text-gray-600">
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                    <span className="text-blue-600">🏠</span>
                    <span>{t("entireAccommodation")}</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                    <span className="text-green-600">🔑</span>
                    <span>{t("selfCheckIn")}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-3">🏡</div>
                <p className="text-lg">{t("noDescription")}</p>
                <p className="text-sm mt-1">{t("contactHost")}</p>
              </div>
            )}
          </section>

          {listing.amenities && listing.amenities.length > 0 && (
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-8 bg-green-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {t("whatThisPlaceOffers")}
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {listing.amenities.map((amenity: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <span className="text-gray-700 font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-8 bg-purple-600 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                {t("cancellationPolicy")}
              </h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-green-600 text-sm">✓</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("freeCancellation")}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {t("freeCancellationDescription")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-yellow-600 text-sm">!</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {t("flexibleBooking")}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {t("flexibleBookingDescription")}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <BookingForm
              listingId={listing.id}
              pricePerNight={listing.pricePerNight}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
