import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetcher } from '../../lib/http';

// Mapeo de unidades
const unitMap = {
  KILOGRAMO: 'kg',
  GRAMO: 'g',
  LITRO: 'L',
  MILILITRO: 'mL',
  TONELADA: 't',
  LIBRA: 'lb',
  ARROBA: 'arroba',
  CARGA: 'Carga',
  BULTO: 'Bulto',
  SACO: 'Saco',
  CAJA: 'Caja',
  CANASTA: 'Canasta',
  ATADO: 'Atado',
  MANOJO: 'Manojo',
  RACIMO: 'Racimo',
  UNIDAD: 'unidad',
  DOCENA: 'docena',
  MEDIA_DOCENA: '½ docena',
  PAR: 'par',
  CUARTILLA: 'cuartilla',
  BOTELLA: 'botella',
};

// Query para obtener inventario del productor
export const useProducerInventoryQuery = () => {
  return useQuery({
    queryKey: ['producerInventory'],
    queryFn: async () => {
      const data = await fetcher('inventory/producer');
      console.log(data);
      return data.map(item => ({
        ...item,
        name: item.product_name || 'Producto sin nombre',
        available: Number(item.available_quantity?.toFixed(2) ?? 0),
        minThreshold: item.minimum_threshold,
        maxCapacity: item.maximum_capacity,
        unit: unitMap[item.unit] || item.unit?.toLowerCase().replace('kilogramo', 'kg') || 'unidad',
      }));
    },
    staleTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: false,
  });
};

// Mutation para crear inventario
export const useCreateInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (createInventoryDto) => {
      return await fetcher('inventory', {
        method: 'POST',
        body: createInventoryDto,
      });
    },
    onSuccess: () => {
      // Invalidar la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['producerInventory'] });
    },
  });
};

// Mutation para actualizar inventario
export const useUpdateInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updateInventoryDto }) => {
      return await fetcher(`inventory/${id}`, {
        method: 'PATCH',
        body: updateInventoryDto,
      });
    },
    onSuccess: () => {
      // Invalidar la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['producerInventory'] });
    },
  });
};

// Mutation para eliminar inventario
export const useDeleteInventoryMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      return await fetcher(`inventory/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      // Invalidar la query para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ['producerInventory'] });
    },
  });
};