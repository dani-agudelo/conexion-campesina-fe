import { ShoppingCart, Star, StarHalf } from "lucide-react";
import { useState, useCallback } from "react";
import "./ProductOverview.css";
import { useCart } from "../../../state/cart";
import QuantityModal from "../../catalog/QuantityModal";

const ProductOverview = ({ product, summary }) => {
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} size={16} fill="#ffc107" color="#ffc107" />);
    }
    if (hasHalfStar) {
      stars.push(
        <StarHalf key="half" size={16} fill="#ffc107" color="#ffc107" />
      );
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={16} color="#ddd" />);
    }
    return stars;
  };
  const addItem = useCart((state) => state.addItem);
  const handleAddToCart = useCallback(
    (quantity) => {
      addItem(product, quantity);
    },
    [product, addItem]
  );
  const [showQuantityModal, setShowQuantityModal] = useState(false);

  const handleOpenModal = useCallback(() => {
    setShowQuantityModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowQuantityModal(false);
  }, []);

  return (
    <div className="header-container">
      <div className="image-section">
        <img
          src={product.imageUrl || "https://via.placeholder.com/500"}
          alt={product.name}
          className="product-image"
        />
      </div>

      <div className="info-section">
        <h1 className="product-title">{product.name}</h1>

        <div className="seller-info">
          <span className="seller-label">Vendido por </span>
          <span className="seller-name">
            {product.producerName || "Productor desconocido"}
          </span>
        </div>

        <div className="rating-container">
          <div className="stars">
            {renderStars(summary?.averageRating || 0)}
          </div>
          <span className="review-count">
            {(() => {
              const total = summary?.totalReviews || 0;
              return `(${total} reseñ${total === 1 ? 'a' : 'as'})`;
            })()}
          </span>
        </div>

        <div className="price-container">
          <span className="price">${product.price.toFixed(2)}</span>
          <span className="unit"> / {product.unit}</span>
        </div>

        <button className="add-to-cart-btn" onClick={handleOpenModal}>
          <ShoppingCart size={20} />
          <span>Añadir al carrito</span>
        </button>
        <QuantityModal
          isOpen={showQuantityModal}
          onClose={handleCloseModal}
          onConfirm={handleAddToCart}
          productName={product.name}
          unit={product.unit}
        />
      </div>
    </div>
  );
};

export default ProductOverview;
