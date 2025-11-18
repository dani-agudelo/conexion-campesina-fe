import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getReviewProduct,
  getSumaryReview, createReview
, updateReview, deleteReview
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

export const useCreateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData) => createReview(reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["reviewSummary"]);
    },
    onError: (error) => {
      console.error("Error al crear la reseña:", error);
      showErrorAlert("Hubo un error en la creación de la reseña");
    },
  });
};

export const useUpdateReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewData, reviewId }) =>
      updateReview(reviewData, reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["reviewSummary"]);
    },
    onError: (error) => {
      console.error("Error al actualizar la reseña:", error);
      showErrorAlert("Hubo un error en la actualización de la reseña");
    },
  });
};

export const useDeleteReviewMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId) => deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries(["reviews"]);
      queryClient.invalidateQueries(["reviewSummary"]);
    },
    onError: (error) => {
      console.error("Error al eliminar la reseña:", error);
      showErrorAlert("Hubo un error en la eliminación de la reseña");
    },
  });
};
