import { useQuery } from "@tanstack/react-query";
import { getInsights } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export function useInsights() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["insights"],
    queryFn: getInsights,
    enabled: Boolean(token),
  });
}
