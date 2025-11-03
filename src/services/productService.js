import { fetcher } from "../lib/http";

/**
 * Servicio para gestión de productos
 * Maneja las llamadas al backend para CRUD de productos
 */

// Exportaciones individuales para usar con React Query
export const getProductsProducer = async () => {
  return await fetcher("product/offer/get/producer");
};

export const createProduct = async (productData) => {
  return await fetcher("product/offer/", { method: "POST", body: productData });
};

export const updateProduct = async (productId, productData) => {
  return await fetcher(`product/offer/${productId}`, {
    method: "PATCH",
    body: productData,
  });
};

export const deleteProduct = async (productId) => {
  return await fetcher(`product/offer/${productId}`, { method: "DELETE" });
};

export const getProductsBase = async () => {
  return await fetcher("product/base");
};
