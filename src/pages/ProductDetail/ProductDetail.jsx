import { useParams } from "react-router-dom";
import {
  useProductReviews,
  useReviewSummary,
} from "../../hooks/query/useReview";
import { useProductByIdQuery } from "../../hooks/query/useProductProducer";
import ProductOverview from "../../components/productDetail/ProductOverview";
import ProductInfo from "../../components/productDetail/ProductInfo";
import ProductReviews from "../../components/productDetail/ProductReviews";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { productId } = useParams();

  const {
    data: product,
    isLoading: loadingProduct,
    error: errorProduct,
  } = useProductByIdQuery(productId);

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

  if (!product) {
    return <div className="error">Producto no encontrado</div>;
  }

  return (
    <div className="page-container">
      {/* ✅ Pasar datos como props */}
      <ProductOverview product={product} summary={summary} />
      <ProductInfo product={product} />
      <ProductReviews reviews={reviews} summary={summary} />
    </div>
  );
};

export default ProductDetail;
