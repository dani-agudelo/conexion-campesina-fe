import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviewProduct,
  getSumaryReview,
  createReview,
  updateReview,
  deleteReview,
  hasReviewed,
} from "../../services/reviewService";
import { showErrorAlert } from "../../utils/sweetAlert";

/**
 * Hook para obtener todas las reseñas de un producto específico
 */
export const useProductReviews = (productOfferId) => {
  return useQuery({
    queryKey: ["reviews", productOfferId],
    queryFn: () => getReviewProduct(productOfferId),
    enabled: !!productOfferId,
    staleTime: 1000 * 60 * 5,
  });
};

/**
 * Hook para obtener el resumen de calificaciones de un producto
 */
export const useReviewSummary = (productOfferId) => {
  return useQuery({
    queryKey: ["reviewSummary", productOfferId],
    queryFn: () => getSumaryReview(productOfferId),
    enabled: !!productOfferId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useHasReviewed = (productOfferId) => {
  return useQuery({
    queryKey: ["hasReviewed", productOfferId],
    queryFn: () => hasReviewed(productOfferId),
    enabled: !!productOfferId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData) => createReview(reviewData),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["reviews", variables.productOfferId]);
      queryClient.invalidateQueries(["reviewSummary", variables.productOfferId]);
      queryClient.invalidateQueries(["hasReviewed", variables.productOfferId]);
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewData, reviewId }) =>
      updateReview(reviewData, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewSummary"] });
      queryClient.invalidateQueries({ queryKey: ["hasReviewed"] });
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId) => deleteReview(reviewId),
    onSuccess: () => {
      // Invalidar todas las queries de reviews para refrescar la UI
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviewSummary"] });
      queryClient.invalidateQueries({ queryKey: ["hasReviewed"] });
    },
  });
};
