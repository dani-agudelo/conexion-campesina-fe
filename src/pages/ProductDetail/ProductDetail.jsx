import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  useProductReviews,
  useReviewSummary,
  useHasReviewed,
} from "../../hooks/query/useReview";
import { useProductByIdQuery } from "../../hooks/query/useProductProducer";
import ProductOverview from "../../components/productDetail/ProductOverview";
import ProductInfo from "../../components/productDetail/ProductInfo";
import ProductReviews from "../../components/review/ProductReviews";
import ReviewModal from "../../components/review/ReviewModal";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { productId } = useParams();
  const [reviewToEdit, setReviewToEdit] = useState(null);

  const {
    data: product,
    isLoading: loadingProduct,
    error: errorProduct,
  } = useProductByIdQuery(productId);

  const { data: hasReview, error: errorHasReview } = useHasReviewed(productId);

  const { data: reviews = [], isLoading: loadingReviews } =
    useProductReviews(productId);

  const { data: summary, isLoading: loadingSummary } =
    useReviewSummary(productId);

  if (loadingProduct || loadingSummary || loadingReviews) {
    return <div className="loading">Cargando producto...</div>;
  }

  if (errorProduct) {
    return <div className="error">Error al cargar el producto</div>;
  }

  if (errorHasReview) {
    console.log("error al validar el cliente review");
  }

  if (!product) {
    return <div className="error">Producto no encontrado</div>;
  }

  // Handler para abrir el modal de edición con la reseña seleccionada
  const handleEditReview = (review) => {
    setReviewToEdit(review);
  };

  // Handler para cerrar el modal y limpiar el estado
  const handleCloseEditModal = () => {
    setReviewToEdit(null);
  };  
  return (
    <div className="page-container">
      <ProductOverview product={product} summary={summary} />
      <ProductInfo product={product} />

      {/* Botón para crear nueva reseña (solo si no tiene reseña) */}
      {hasReview && (
        <ReviewModal
          productId={productId}
          existingReview={null}
          onReviewSubmitted={() => {
            // Invalidar queries se hace automáticamente en el hook
          }}
        />
      )}

      {/* Lista de reseñas con opción de editar */}
      <ProductReviews
        reviews={reviews}
        summary={summary}
        onEditReview={handleEditReview}
      />

      {/* Modal de edición (se muestra cuando reviewToEdit tiene valor) */}
      {reviewToEdit && (
        <ReviewModal
          productId={productId}
          existingReview={reviewToEdit}
          onReviewSubmitted={handleCloseEditModal}
        />
      )}
    </div>
  );
};

export default ProductDetail;
