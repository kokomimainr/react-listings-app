export interface Listing {
  id: string;
  title: string;
  city: string;
  pricePerNight: number;
  rating: number;
  thumbnailUrl?: string;
  bookingsCount?: number;
  description?: string;
}

export interface ListingDetail extends Listing {
  photos: string[];
  amenities: string[];
  description: string;
  bookingsCount: number;
}

export interface Booking {
  id: string;
  listingId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  createdAt: string;
}

export interface BookingRequest {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}