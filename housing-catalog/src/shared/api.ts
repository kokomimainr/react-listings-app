import axios from "axios";
import { useAuthStore } from "@/app/providers/store/ZustandStore";
import type { BookingRequest, Booking } from "@/shared/types";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Authentication failed");
      const logout = useAuthStore.getState().logout;
      logout();
    }
    return Promise.reject(error);
  }
);

export function attachAuth(token?: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

export const bookingsApi = {
  create: (booking: BookingRequest) => api.post<Booking>("/bookings", booking),
};

export const listingsApi = {
  getById: (id: string) => api.get(`/api/listings/${id}`),
};

export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string; user: any }>("/auth/login", credentials),
};
