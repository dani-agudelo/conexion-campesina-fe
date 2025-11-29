import { fetcher } from "../lib/http";

/**
 * Servicio para gestión de reviews
 * Maneja las llamadas al backend para CRUD de productos
 */

export const getReviewProduct = async (productOfferId) => {
  return await fetcher(`review/product-offer/${productOfferId}`);
};

export const getSumaryReview = async (productOfferId) => {
  return await fetcher(`review/summary/${productOfferId}`);
};

export const createReview = async (reviewData) => {
  return await fetcher("review", {
    method: "POST",
    body: reviewData,
  });
};

export const updateReview = async (reviewData, reviewId) => {
  return await fetcher(`review/${reviewId}`, {
    method: "PATCH",
    body: reviewData,
  });
};

export const deleteReview = async (reviewId) => {
  return await fetcher(`review/client/${reviewId}`, {
    method: "DELETE",
  });
};

export const hasReviewed = async (productOfferId) => {
  return await fetcher(`review/has-reviewed/${productOfferId}`);
};
