import React from 'react';
import './CartItem.css';

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    onRemove(item.id);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="cart-item">
      <div className="cart-item__main">
        <div className="cart-item__image-container">
          <img
            src={item.imageUrl || '/placeholder-product.png'}
            alt={item.name}
            className="cart-item__image"
            onError={(e) => {
              e.target.src = '/placeholder-product.png';
            }}
          />
        </div>

        <div className="cart-item__info">
          <h4 className="cart-item__name">{item.name}</h4>
          <p className="cart-item__unit-price">
            ${item.price?.toLocaleString('es-CO')} / {item.unit || 'kg'}
          </p>
        </div>
      </div>

      <div className="cart-item__actions">
        <div className="cart-item__quantity-controls">
          <button
            className="cart-item__quantity-btn cart-item__quantity-btn--decrease"
            onClick={handleDecrease}
            aria-label="Disminuir cantidad"
          >
            -
          </button>
          <span className="cart-item__quantity">{item.quantity}</span>
          <button
            className="cart-item__quantity-btn cart-item__quantity-btn--increase"
            onClick={handleIncrease}
            aria-label="Aumentar cantidad"
          >
            +
          </button>
        </div>

        <div className="cart-item__subtotal">
          ${subtotal.toFixed(2)}
        </div>

        <button
          className="cart-item__remove-btn"
          onClick={handleRemove}
          title="Eliminar del carrito"
          aria-label="Eliminar del carrito"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3,6 5,6 21,6"/>
            <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CartItem;