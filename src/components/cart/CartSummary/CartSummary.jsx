import React from 'react';
import CartItem from '../CartItem/CartItem';
import './CartSummary.css';

const CartSummary = ({ cartItems = [], loading = false, onUpdateQuantity, onRemove, onCheckout, onContinueShopping }) => {
  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="cart-summary">
        <div className="cart-summary__loading">
          <div className="cart-summary__spinner"></div>
          <p>Cargando carrito...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="cart-summary">
        <div className="cart-summary__empty">
          <div className="cart-summary__empty-icon">🛒</div>
          <h3>Tu carrito está vacío</h3>
          <p>Agrega productos para comenzar tu compra</p>
          {onContinueShopping && (
            <button 
              className="cart-summary__empty-btn"
              onClick={onContinueShopping}
            >
              Ver Productos
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-summary">
      <div className="cart-summary__header">
        <h2 className="cart-summary__title">Tu Carrito de Compras</h2>
        <span className="cart-summary__count">
          {cartItems.length} {cartItems.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="cart-summary__items">
        {cartItems.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </div>

      <div className="cart-summary__footer">
        <div className="cart-summary__total">
          <span className="cart-summary__total-label">Total:</span>
          <span className="cart-summary__total-amount">
            ${calculateTotal().toFixed(2)}
          </span>
        </div>

        <div className="cart-summary__actions">
          <button 
            className="cart-summary__checkout-btn"
            onClick={onCheckout}
          >
            Proceder al Pago
          </button>
          
          {onContinueShopping && (
            <button 
              className="cart-summary__continue-btn"
              onClick={onContinueShopping}
            >
              Seguir Comprando
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartSummary;