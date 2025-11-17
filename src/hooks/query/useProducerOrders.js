import { useQuery } from "@tanstack/react-query";
import { getProducerOrders } from "../../services/orderService";

export const useProducerOrdersQuery = () => {
  return useQuery({
    queryKey: ["producerOrders"],
    queryFn: getProducerOrders,
    staleTime: 1000 * 60 * 5,
  });
};

