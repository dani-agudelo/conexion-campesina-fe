import { Star, Edit } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "../../../hooks/query/useReview";
import Swal from "sweetalert2";
import "./ReviewModal.css";

const ReviewModal = ({
  productId,
  existingReview = null,
  onReviewSubmitted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createReview = useCreateReviewMutation();
  const updateReview = useUpdateReviewMutation();

  const isEditMode = !!existingReview;

  const handleOpenReviewModal = useCallback(() => {
    Swal.fire({
      title: isEditMode ? "Editar tu Reseña" : "Dejar una Reseña",
      html: `
        <div class="review-modal-content">
          <p class="review-subtitle">${
            isEditMode
              ? "Actualiza tu calificación y opinión."
              : "Califica este producto y comparte tu opinión."
          }</p>
          
          <div class="rating-section">
            <label class="rating-label">Tu calificación</label>
            <div class="stars-container" id="starsContainer">
              ${[1, 2, 3, 4, 5]
                .map(
                  (num) => `
                <span class="star-btn" data-rating="${num}">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ddd" stroke-width="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
              `
                )
                .join("")}
            </div>
          </div>

          <div class="opinion-section">
            <label class="opinion-label">Tu opinión</label>
            <textarea 
              id="reviewText" 
              class="review-textarea" 
              placeholder="Cuéntanos más sobre el producto, su calidad, frescura, etc."
              rows="5"
            >${existingReview?.comments || ""}</textarea>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: isEditMode ? "Actualizar Reseña" : "Enviar Reseña",
      cancelButtonText: "Cancelar",
      customClass: {
        popup: "review-modal-popup",
        title: "review-modal-title",
        confirmButton: "review-confirm-btn",
        cancelButton: "review-cancel-btn",
      },
      didOpen: () => {
        const stars = document.querySelectorAll(".star-btn");
        let selectedRating = existingReview?.rating || 0;

        // Inicializar con la calificación existente
        if (existingReview?.rating) {
          updateStars(existingReview.rating);
        }

        stars.forEach((star) => {
          star.addEventListener("click", function () {
            selectedRating = parseInt(this.getAttribute("data-rating"));
            updateStars(selectedRating);
          });

          star.addEventListener("mouseenter", function () {
            const rating = parseInt(this.getAttribute("data-rating"));
            updateStars(rating, true);
          });
        });

        const container = document.getElementById("starsContainer");
        container.addEventListener("mouseleave", () => {
          updateStars(selectedRating);
        });

        function updateStars(rating, isHover = false) {
          stars.forEach((star, index) => {
            const svg = star.querySelector("svg polygon");
            if (index < rating) {
              svg.setAttribute("fill", isHover ? "#ffdb4d" : "#ffc107");
              svg.setAttribute("stroke", "#ffc107");
            } else {
              svg.setAttribute("fill", "none");
              svg.setAttribute("stroke", "#ddd");
            }
          });
        }

        // Store rating in a custom property
        Swal.getPopup().dataset.selectedRating = String(selectedRating);
        stars.forEach((star) => {
          star.addEventListener("click", function () {
            Swal.getPopup().dataset.selectedRating =
              this.getAttribute("data-rating");
          });
        });
      },
      preConfirm: () => {
        const rating = parseInt(Swal.getPopup().dataset.selectedRating);
        const reviewText = document.getElementById("reviewText").value.trim();

        if (rating === 0) {
          Swal.showValidationMessage("Por favor selecciona una calificación");
          return false;
        }

        if (!reviewText) {
          Swal.showValidationMessage("Por favor escribe tu opinión");
          return false;
        }

        return {
          rating,
          comment: reviewText,
        };
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsSubmitting(true);
        try {
          const reviewData = {
            rating: result.value.rating,
            comments: result.value.comment,
            productOfferId: productId,
          };

          if (isEditMode) {
            delete reviewData.productOfferId;
            // Actualizar reseña existente
            await updateReview.mutateAsync({
              reviewId: existingReview.id,
              reviewData,
            });
          } else {
            // Crear nueva reseña
            await createReview.mutateAsync(reviewData);
          }

          Swal.fire({
            title: "¡Gracias!",
            text: isEditMode
              ? "Tu reseña ha sido actualizada exitosamente"
              : "Tu reseña ha sido enviada exitosamente",
            icon: "success",
            confirmButtonText: "Cerrar",
            customClass: {
              confirmButton: "review-confirm-btn",
            },
          });

          if (onReviewSubmitted) {
            onReviewSubmitted();
          }
        } catch (error) {
          Swal.fire({
            title: "Error",
            text: isEditMode
              ? "No se pudo actualizar tu reseña. Intenta nuevamente."
              : "No se pudo enviar tu reseña. Intenta nuevamente.",
            icon: "error",
            confirmButtonText: "Cerrar",
            customClass: {
              confirmButton: "review-confirm-btn",
            },
          });
        } finally {
          setIsSubmitting(false);
        }
      }
    });
  }, [
    productId,
    existingReview,
    isEditMode,
    createReview,
    updateReview,
    onReviewSubmitted,
  ]);

  // Abrir automáticamente el modal cuando se pasa una reseña existente
  useEffect(() => {
    if (existingReview) {
      handleOpenReviewModal();
    }
  }, [existingReview, handleOpenReviewModal]);

  // Si es modo edición, no mostrar el botón (se abre automáticamente)
  if (isEditMode) {
    return null;
  }

  return (
    <button
      className="leave-review-btn"
      onClick={handleOpenReviewModal}
      disabled={isSubmitting}
    >
      <Star size={20} />
      <span>{isSubmitting ? "Enviando..." : "Dejar una Reseña"}</span>
    </button>
  );
};

export default ReviewModal;
