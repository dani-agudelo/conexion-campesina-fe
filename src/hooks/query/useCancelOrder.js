import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelOrder } from '../../services/orderService';

export const useCancelOrderMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      // Invalidar la query de órdenes del cliente para refrescar la lista
      queryClient.invalidateQueries({ queryKey: ['clientOrders'] });
    },
  });
};

