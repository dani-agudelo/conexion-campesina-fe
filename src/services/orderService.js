import { fetcher } from '../lib/http';

export const createOrder = async (orderData) => {
  return await fetcher('orders', {
    method: 'POST',
    body: orderData,
  });
};

