import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi, type LoginRequest } from "@/shared/api";
import { useAuthStore } from "@/app/providers/ZustandStore";

export const useLogin = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => 
      authApi.login(credentials).then(res => res.data),
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["auth"] });
    },
  });
};