import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/lib/api";

export function useLogin() {
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      loginApi.login(data),
  });
}
