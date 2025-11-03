import { useQuery } from "@tanstack/react-query";
import { getProductsBase } from "../../services/productService";

export const useProductBaseQuery = () => {
  return useQuery({
    queryKey: ["productBaseData"],
    queryFn: getProductsBase,
    staleTime: 1000 * 60 * 5,
  });
};
