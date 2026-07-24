import { useQuery } from "@tanstack/react-query";
import { getBusiness } from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

export function useBusiness() {
  const { token } = useAuth();
  return useQuery({
    queryKey: ["business"],
    queryFn: getBusiness,
    enabled: Boolean(token),
  });
}
