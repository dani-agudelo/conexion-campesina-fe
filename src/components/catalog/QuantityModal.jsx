import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import './QuantityModal.css';

const QuantityModal = ({ isOpen, onClose, onConfirm, productName, unit }) => {
  const [quantity, setQuantity] = useState(1);
  const overlayRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Prevenir scroll del body cuando el modal está abierto
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (quantity > 0) {
      onConfirm(quantity);
      setQuantity(1);
      onClose();
    }
  };

  const handleCancel = () => {
    setQuantity(1);
    onClose();
  };

  const handleOverlayClick = (e) => {
    // Solo cerrar si el click fue directamente en el overlay
    if (e.target === overlayRef.current) {
      handleCancel();
    }
  };

  return createPortal(
    <div 
      ref={overlayRef}
      className="quantity-modal-overlay" 
      onClick={handleOverlayClick}
    >
      <div className="quantity-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Agregar al Carrito</h3>
        <p className="product-name">{productName}</p>
        
        <div className="quantity-input-group">
          <label htmlFor="quantity">Cantidad:</label>
          <div className="quantity-control">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1}
            >
              −
            </button>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 1;
                setQuantity(Math.max(1, val));
              }}
            />
            <button onClick={() => setQuantity(quantity + 1)}>+</button>
          </div>
          {unit && (
            <span className="unit-label">{unit.symbol || unit.name}</span>
          )}
        </div>

        <div className="quantity-modal-actions">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancelar
          </button>
          <button className="confirm-btn" onClick={handleConfirm}>
            Agregar
          </button>
        </div>
      </div>
    </div>,
    document.body 
  );
};

export default QuantityModal;

