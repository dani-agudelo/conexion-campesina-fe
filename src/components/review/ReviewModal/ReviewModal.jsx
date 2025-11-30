import { Star, Edit } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import {
  useCreateReviewMutation,
  useUpdateReviewMutation,
} from "../../../hooks/query/useReview";
import Swal from "sweetalert2";
import "./ReviewModal.css";

// 💡 Función auxiliar corregida para manejar errores anidados como cadena JSON
const getBackendErrorMessage = (error) => {
  let errorData = null;

  // 1. Intentar parsear si el mensaje es una cadena JSON
  try {
    // Si el error.message es una cadena JSON (como en tu terminal), la parseamos
    errorData = JSON.parse(error.message);
  } catch (e) {
    // Si no es una cadena JSON (es un objeto Error normal o una respuesta HTTP directa)
    errorData = error.response?.data || error;
  }

  // 2. Extraer el mensaje específico
  if (errorData && errorData.message) {
    // Si 'message' es un array, lo unimos (Ej: ["comments must be longer..."])
    if (Array.isArray(errorData.message) && errorData.message.length > 0) {
      // Traducir mensajes comunes del backend al español si es posible
      const translatedMessages = errorData.message.map((msg) => {
        if (msg.includes("comments must be longer than or equal to")) {
          const length = msg.match(/(\d+)/)?.[0] || "10";
          return `El comentario debe tener al menos ${length} caracteres.`;
        }
        return msg;
      });
      return translatedMessages.join("; ");
    }

    // Si 'message' es un string simple
    return errorData.message;
  }

  // 3. Fallback para otros errores o estructura desconocida
  return "Error desconocido. Por favor, inténtalo de nuevo.";
};

const ReviewModal = ({
  productId,
  existingReview = null,
  open = false,
  onClose,
  onReviewSubmitted,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(open);
  const createReview = useCreateReviewMutation();
  const updateReview = useUpdateReviewMutation();

  const isEditMode = !!existingReview;

  // Sincronizar estado abierto con prop open
  useEffect(() => {
    setIsOpen(open);
  }, [open]);

  const handleOpenReviewModal = useCallback(() => {
    setIsOpen(true);
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
          // 💡 Manejo de errores corregido
          const errorMessage = getBackendErrorMessage(error);

          Swal.fire({
            title: "Error de Validación",
            text: `No se pudo procesar tu reseña: ${errorMessage}`, // Muestra el mensaje específico del backend
            icon: "error",
            confirmButtonText: "Cerrar",
            customClass: {
              confirmButton: "review-confirm-btn",
            },
          });
          // Opcional: registrar el error completo en la consola para depuración
          console.error("Error al procesar la reseña:", error);
        } finally {
          setIsSubmitting(false);
        }
      }
      // Cerrar modal al enviar o cancelar
      setIsOpen(false);
      if (onClose) onClose();
    });
  }, [
    productId,
    existingReview,
    isEditMode,
    createReview,
    updateReview,
    onReviewSubmitted,
    onClose,
  ]);

  // Modal controlado: abrir si isOpen es true, usando useEffect para evitar bucles
  useEffect(() => {
    if (isEditMode && isOpen) {
      handleOpenReviewModal();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode, isOpen]);

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
