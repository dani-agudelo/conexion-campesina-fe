import { useMutation } from "@tanstack/react-query";
import { fetcher } from "../../lib/http";

export function useCreateInventoryMutation() {
  return useMutation({
    mutationFn: async (inventoryData) => {
      return await fetcher("inventory", {
        method: "POST",
        body: inventoryData,
      });
    },
  });
}
