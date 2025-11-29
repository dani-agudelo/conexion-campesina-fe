import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShippingById,
  getShippingByOrder,
  getDocumentShipping,
  createShipping,
} from "../../services/shippingService";
import { showErrorAlert } from "../../utils/sweetAlert";

// Buscar recibo de envío por ID de shipping
export const useShippingById = (id) => {
  return useQuery({
    queryKey: ["shippingById", id],
    queryFn: () => getShippingById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};

// Buscar recibo de envío por ID de orden
export const useShippingByOrder = (orderId) => {
  return useQuery({
    queryKey: ["shippingByOrder", orderId],
    queryFn: () => getShippingByOrder(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5,
  });
};

// Descargar documento PDF de envío
export const useDocumentShipping = (orderId) => {
  return useQuery({
    queryKey: ["shippingDocument", orderId],
    queryFn: () => getDocumentShipping(orderId),
    enabled: !!orderId,
    staleTime: 1000 * 60 * 5,
  });
};

// Crear recibo de envío
export const useCreateShippingMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => createShipping(orderId),
    onSuccess: (_, orderId) => {
      // Invalida queries relacionadas
      queryClient.invalidateQueries(["shippingByOrder", orderId]);
      queryClient.invalidateQueries(["shippingDocument", orderId]);
    },
    onError: (error) => {
      console.error("Error al crear el envío:", error);
      showErrorAlert("Hubo un error en la creación del envío");
    },
  });
};
