import { useQuery } from "@tanstack/react-query";
import { getClientOrders } from "../../services/orderService";

export const useClientOrdersQuery = () => {
  return useQuery({
    queryKey: ["clientOrders"],
    queryFn: getClientOrders,
    staleTime: 1000 * 60 * 5,
  });
};

