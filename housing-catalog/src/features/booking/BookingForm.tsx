import React, { useState } from "react";
import { useCreateBooking } from "@/hooks/useCreateBooking";
import { useAuthStore } from "@/app/providers/store/ZustandStore";

interface BookingFormProps {
  listingId: string;
  pricePerNight: number;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  listingId,
  pricePerNight,
}) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [error, setError] = useState("");

  const token = useAuthStore((s) => s.token);
  const { 
    mutate: createBooking, 
    isPending, 
    isError, 
    isSuccess,
    reset 
  } = useCreateBooking();

  const calculateTotal = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return nights * pricePerNight;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Please login to book");
      return;
    }

    if (!checkIn || !checkOut) {
      setError("Please select dates");
      return;
    }

    createBooking(
      { listingId, checkIn, checkOut, guests },
      {
        onError: (err: any) => {
          if (err.response?.status === 409) {
            setError("These dates are not available");
          } else {
            setError("Booking failed. Please try again.");
          }
        },
      }
    );
  };

  const handleBookAgain = () => {
    reset();
    setCheckIn("");
    setCheckOut("");
    setGuests(1);
    setError("");
  };

  const today = new Date().toISOString().split("T")[0];

  // Если успешно забронировали - показываем сообщение
  if (isSuccess) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md border">
        <div className="text-center">
          <div className="text-green-500 text-4xl mb-3">✅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600 text-sm">
            Your booking has been successfully created.
          </p>
          <button
            onClick={handleBookAgain}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            Book Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-lg font-semibold mb-4">Book this place</h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="checkIn"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Check-in
            </label>
            <input
              id="checkIn"
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              min={today}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              htmlFor="checkOut"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Check-out
            </label>
            <input
              id="checkOut"
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              min={checkIn || today}
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="guests"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Guests
          </label>
          <select
            id="guests"
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <option key={num} value={num}>
                {num} {num === 1 ? "guest" : "guests"}
              </option>
            ))}
          </select>
        </div>

        {calculateTotal() > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">
                ${pricePerNight} ×{" "}
                {Math.ceil(
                  (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                nights
              </span>
              <span className="font-semibold">${calculateTotal()}</span>
            </div>
          </div>
        )}

        {(error || isError) && (
          <div className="text-red-600 text-sm bg-red-50 p-2 rounded border border-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || !token}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Booking...
            </span>
          ) : token ? (
            "Book Now"
          ) : (
            "Login to Book"
          )}
        </button>
      </form>
    </div>
  );
};