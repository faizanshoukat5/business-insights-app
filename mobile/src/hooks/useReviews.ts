import { useQuery } from "@tanstack/react-query";
import { getReviews } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export function useReviews() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["reviews"],
    queryFn: getReviews,
    enabled: Boolean(token),
  });
}
