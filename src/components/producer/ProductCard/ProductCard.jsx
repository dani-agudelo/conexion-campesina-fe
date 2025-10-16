import React from 'react';
import './ProductCard.css';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const handleEdit = () => {
    onEdit(product);
  };

  const handleDelete = () => {
    onDelete(product.id);
  };

  return (
    <tr className="product-card">
      <td className="product-card__product">
        <div className="product-card__product-info">
          <div className="product-card__image-container">
            <img
              src={product.imageUrl || '/placeholder-product.png'}
              alt={product.name}
              className="product-card__image"
              onError={(e) => {
                e.target.src = '/placeholder-product.png';
              }}
            />
          </div>
          <div className="product-card__details">
            <h4 className="product-card__name">{product.name}</h4>
            <span className="product-card__category">
              {product.category?.charAt(0).toUpperCase() + product.category?.slice(1) || 'Sin categoría'}
            </span>
          </div>
        </div>
      </td>
      
      <td className="product-card__description">
        <p className="product-card__description-text">
          {product.description}
        </p>
      </td>
      
      <td className="product-card__price">
        <span className="product-card__price-amount">
          ${product.price?.toLocaleString('es-CO')}
        </span>
        <span className="product-card__price-unit">
          /{product.unit || 'unidad'}
        </span>
      </td>
      
      <td className="product-card__quantity">
        <span className="product-card__quantity-amount">
          {product.quantity}
        </span>
        <span className="product-card__quantity-unit">
          {product.unit || 'unidad'}
        </span>
      </td>
      
      <td className="product-card__actions">
        <div className="product-card__action-buttons">
          <button
            className="product-card__action-btn product-card__action-btn--edit"
            onClick={handleEdit}
            title="Editar producto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          
          <button
            className="product-card__action-btn product-card__action-btn--delete"
            onClick={handleDelete}
            title="Eliminar producto"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3,6 5,6 21,6"/>
              <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
              <line x1="10" y1="11" x2="10" y2="17"/>
              <line x1="14" y1="11" x2="14" y2="17"/>
            </svg>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default ProductCard;
