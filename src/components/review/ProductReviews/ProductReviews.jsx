import "./ProductReviews.css";
import { Star, Edit, Trash2 } from "lucide-react";
import { useUserQuery } from "../../../hooks/query/useUserQuery.js";
import { useDeleteReviewMutation } from "../../../hooks/query/useReview";
import Swal from "sweetalert2";

const ProductReviews = ({ reviews, summary, onEditReview }) => {
  const { data: { user: currentUser } = {} } = useUserQuery();
  const deleteReview = useDeleteReviewMutation();

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<Star key={i} size={14} fill="#ffc107" color="#ffc107" />);
    }
    return stars;
  };

  const getBarWidth = (count) => {
    return summary?.totalReviews > 0
      ? `${(count / summary.totalReviews) * 100}%`
      : "0%";
  };

  const handleDeleteReview = async (reviewId, reviewerName) => {
    const result = await Swal.fire({
      title: "¿Eliminar reseña?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      customClass: {
        popup: "review-modal-popup",
        confirmButton: "review-delete-btn",
        cancelButton: "review-cancel-btn",
      },
    });

    if (result.isConfirmed) {
      try {
        await deleteReview.mutateAsync(reviewId);

        Swal.fire({
          title: "¡Eliminada!",
          text: "Tu reseña ha sido eliminada exitosamente",
          icon: "success",
          confirmButtonText: "Cerrar",
          customClass: {
            confirmButton: "review-confirm-btn",
          },
        });
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: `No se pudo eliminar la reseña. Intenta nuevamente.${error.message[0]} `,
          icon: "error",
          confirmButtonText: "Cerrar",
          customClass: {
            confirmButton: "review-confirm-btn",
          },
        });
      }
    }
  };

  // Verificar si el usuario actual es el autor de la reseña
  const isReviewOwner = (review) => {
    if (!currentUser) return false;

    // Comparar por ID de usuario si está disponible
    if (review.clientId && currentUser.id) {
      return review.clientId === currentUser.id;
    }

    // Fallback: comparar por nombre si no hay ID
    return review.clientName === currentUser.fullname;
  };

  // Convertir ratingDistribution a formato de array
  const distribution = summary?.ratingDistribution
    ? [
        { stars: 5, count: summary.ratingDistribution[5] || 0 },
        { stars: 4, count: summary.ratingDistribution[4] || 0 },
        { stars: 3, count: summary.ratingDistribution[3] || 0 },
        { stars: 2, count: summary.ratingDistribution[2] || 0 },
        { stars: 1, count: summary.ratingDistribution[1] || 0 },
      ]
    : [];

  return (
    <div className="reviews-container">
      <div className="reviews-header">
        <h2 className="section-title">Ratings & Reviews</h2>
      </div>

      <div className="reviews-summary">
        <div className="average-rating">
          <div className="rating-number">
            {summary?.averageRating?.toFixed(1) || "0.0"}
          </div>
          <div className="stars-large">
            {renderStars(Math.floor(summary?.averageRating || 0))}
          </div>
          <div className="total-reviews">
            Based on {summary?.totalReviews || 0} reviews
          </div>
        </div>

        <div className="rating-bars">
          {distribution.map((item) => (
            <div key={item.stars} className="bar-row">
              <span className="star-label">{item.stars} star</span>
              <div className="bar-background">
                <div
                  className="bar-fill"
                  style={{ width: getBarWidth(item.count) }}
                />
              </div>
              <span className="count-label">{item.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="reviews-list">
        {reviews && reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="reviewer-info">
                  <div className="avatar">
                    {review.clientName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div>
                    <div className="reviewer-name">
                      {review.clientName || "Usuario"}
                      {isReviewOwner(review) && (
                        <span className="you-badge">Tú</span>
                      )}
                    </div>
                    <div className="review-time">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="review-actions">
                  <div className="review-stars">
                    {renderStars(review.rating)}
                  </div>

                  {isReviewOwner(review) && (
                    <div className="action-buttons">
                      <button
                        className="action-btn edit-btn"
                        onClick={() => onEditReview(review)}
                        title="Editar reseña"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={() =>
                          handleDeleteReview(review.id, review.clientName)
                        }
                        title="Eliminar reseña"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="review-text">{review.comments}</p>
            </div>
          ))
        ) : (
          <p className="no-reviews">No hay reseñas aún</p>
        )}
      </div>

      {reviews && reviews.length > 2 && (
        <button className="view-all-btn">View All Reviews</button>
      )}
    </div>
  );
};

export default ProductReviews;

