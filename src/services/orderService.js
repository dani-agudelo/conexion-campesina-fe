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

export const getClientOrders = async () => {
  return await fetcher('orders/client/me');
};

export const retryPayment = async (orderId) => {
  return await fetcher(`orders/${orderId}/retry-payment`);
};

