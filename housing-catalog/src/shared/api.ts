import axios from "axios";
import type { Booking, BookingRequest, ListingDetail } from "./types";


export const api = axios.create({
baseURL: "http://localhost:4000",
headers: {
"Content-Type": "application/json",
},
});

export function attachAuth(token?: string | null) {
if (token) api.defaults.headers.common.Authorization = `Bearer ${token}`;
else delete api.defaults.headers.common.Authorization;
}

export const listingsApi = {
  getById: (id: string) => api.get<ListingDetail>(`api/listings/${id}`),
};

export const bookingsApi = {
  create: (booking: BookingRequest) => api.post<Booking>('/bookings', booking),
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authApi = {
  login: (credentials: LoginRequest) => 
    api.post<LoginResponse>('/auth/login', credentials),
  getMe: () => api.get('/me'),
};