import { useQuery } from '@tanstack/react-query';
import { fetcher } from '../../lib/http';

export function useProducerInventoryQuery() {
  return useQuery({
    queryKey: ['producerInventory'],
    queryFn: async () => {
      const data = await fetcher('inventory/producer');

      // Adaptación de los campos igual que tenías
      return data.map(item => ({
        ...item,
        name: item.name ?? 'Producto sin nombre', 
        available: Number(item.available_quantity.toFixed(2)),
        minThreshold: item.minimum_threshold,
        maxCapacity: item.maximum_capacity,
        unit: item.unit.toLowerCase().replace('kilogramo', 'kg'),
      }));
    },
  });
}
