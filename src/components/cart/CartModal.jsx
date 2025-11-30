import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { useCart } from '../../state/cart';
import { createOrder } from '../../services/orderService';
import './CartModal.css';

const CartModal = ({ isOpen, onClose }) => {
  const items = useCart((state) => state.items);
  const updateQuantity = useCart((state) => state.updateQuantity);
  const removeItem = useCart((state) => state.removeItem);
  const clearCart = useCart((state) => state.clearCart);
  
  const [address, setAddress] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const totalPrice = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  useEffect(() => {
    if (isOpen) {
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    if (!address.trim()) {
      setErrorMessage('Por favor ingresa una dirección de entrega');
      return;
    }

    if (items.length === 0) {
      setErrorMessage('El carrito está vacío');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    try {
      const orderData = {
        address: address.trim(),
        orderDetails: items.map((item) => ({
          productOfferId: item.productOfferId,
          quantity: item.quantity,
        })),
      };

      const response = await createOrder(orderData);

      const paymentUrl = response.paymentSession?.url;

      if (!paymentUrl) {
          throw new Error("El servicio de órdenes no devolvió la URL de pago.");
      }

      clearCart();
      setAddress('');
      onClose();

      window.location.href = paymentUrl;

    } catch (error) {
      console.error('Error al crear la orden:', error);
      setErrorMessage('Error al crear la orden. Por favor intenta nuevamente.');
      const msg = error.message.includes('URL de pago') 
        ? 'Error en la pasarela de pago. Intenta más tarde.'
        : error.message || 'Error al crear la orden. Por favor intenta nuevamente.';
        
      Swal.fire({
          icon: 'error',
          title: 'Error de Compra',
          text: msg,
          confirmButtonColor: '#d33'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-modal-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cart-modal-header">
          <h2>Carrito de Compras</h2>
          <button className="cart-modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cart-modal-content">
              {items.length === 0 ? (
                <div className="cart-empty">
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {items.map((item) => (
                      <div key={item.productOfferId} className="cart-item">
                        <div className="cart-item-image">
                          <img src={item.product.imageUrl} alt={item.product.name} />
                        </div>
                        <div className="cart-item-details">
                          <h3>{item.product.name}</h3>
                          <p className="cart-item-price">
                            ${item.price.toLocaleString()} / {item.product.unit?.symbol || item.product.unit?.name || 'unidad'}
                          </p>
                          <div className="cart-item-actions">
                            <div className="quantity-control">
                              <button
                                onClick={() => updateQuantity(item.productOfferId, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span>{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.productOfferId, item.quantity + 1)}
                              >
                                +
                              </button>
                            </div>
                            <button
                              className="remove-btn"
                              onClick={() => removeItem(item.productOfferId)}
                            >
                              Eliminar
                            </button>
                          </div>
                          <p className="cart-item-total">
                            Total: ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-checkout">
                    <div className="cart-total">
                      <h3>Total: ${totalPrice.toLocaleString()}</h3>
                    </div>
                    <div className="address-input">
                      <label htmlFor="address">Dirección de entrega:</label>
                      <textarea
                        id="address"
                        value={address}
                        onChange={(e) => {
                          setAddress(e.target.value);
                          setErrorMessage('');
                        }}
                        placeholder="Ingresa la dirección de entrega completa"
                        rows="3"
                      />
                      {errorMessage && (
                        <p className="error-message">{errorMessage}</p>
                      )}
                    </div>
                    <button
                      className="checkout-btn"
                      onClick={handleCheckout}
                      disabled={isProcessing || items.length === 0}
                    >
                      {isProcessing ? 'Procesando...' : 'Finalizar Compra'}
                    </button>
                  </div>
                </>
              )}
            </div>
      </div>
    </div>
  );
};

export default CartModal;

