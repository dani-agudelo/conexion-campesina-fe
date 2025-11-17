import { fetcher } from '../lib/http';

export const createOrder = async (orderData) => {
  return await fetcher('orders', {
    method: 'POST',
    body: orderData,
  });
};

export const getProducerOrders = async () => {
  return await fetcher('orders/producer/me');
};

