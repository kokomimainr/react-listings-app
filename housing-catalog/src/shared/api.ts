import axios from "axios";
import { useAuthStore } from "@/app/providers/store/ZustandStore";
import type { BookingRequest, Booking } from "@/shared/types";

export const api = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Перехватчик для автоматического логаута при 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Просто логируем и очищаем токен, без редиректа
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

// API методы для бронирований
export const bookingsApi = {
  create: (booking: BookingRequest) => 
    api.post<Booking>('/bookings', booking),
};

// API методы для листингов (если ещё нет)
export const listingsApi = {
  getById: (id: string) => 
    api.get(`/api/listings/${id}`),
};

// API методы для аутентификации (если ещё нет)
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post<{ token: string; user: any }>('/auth/login', credentials),
};