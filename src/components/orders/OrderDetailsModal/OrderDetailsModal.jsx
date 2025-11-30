import { useEffect } from 'react';
import { XIcon } from '../../icons';
import './OrderDetailsModal.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatDate = (value) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';

  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getStatusLabel = (status) => {
  const statusMap = {
    PAID: 'Pagado',
    PENDING: 'Pendiente',
    CANCELLED: 'Cancelado',
    DELIVERED: 'Entregado',
  };
  return statusMap[status] || status;
};

const getStatusClass = (status) => {
  const statusClassMap = {
    PAID: 'order-details__status--paid',
    PENDING: 'order-details__status--pending',
    CANCELLED: 'order-details__status--cancelled',
    DELIVERED: 'order-details__status--delivered',
  };
  return statusClassMap[status] || '';
};

const OrderDetailsModal = ({ isOpen, onClose, order }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !order) return null;

  const orderDate = formatDate(order.orderDate || order.createdAt);

  return (
    <div className="order-details-overlay" onClick={onClose}>
      <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="order-details-header">
          <div>
            <h2 className="order-details-title">Detalles del Pedido</h2>
          </div>
          <button
            className="order-details-close"
            onClick={onClose}
            aria-label="Cerrar"
          >
            <XIcon size={20} />
          </button>
        </div>

        <div className="order-details-content">
          {/* Información general */}
          <section className="order-details-section">
            <h3 className="order-details-section-title">Información General</h3>
            <div className="order-details-info-grid">
              <div className="order-details-info-item">
                <span className="order-details-info-label">Estado:</span>
                <span className={`order-details__status ${getStatusClass(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="order-details-info-item">
                <span className="order-details-info-label">Fecha:</span>
                <span className="order-details-info-value">{orderDate}</span>
              </div>
              {order.clientName && (
                <div className="order-details-info-item">
                  <span className="order-details-info-label">Cliente:</span>
                  <span className="order-details-info-value">{order.clientName}</span>
                </div>
              )}
              {order.address && (
                <div className="order-details-info-item order-details-info-item--full">
                  <span className="order-details-info-label">Dirección de entrega:</span>
                  <span className="order-details-info-value">{order.address}</span>
                </div>
              )}
            </div>
          </section>

          {/* Productos */}
          <section className="order-details-section">
            <h3 className="order-details-section-title">
              Productos ({order.orderDetails?.length || 0})
            </h3>
            <div className="order-details-products">
              {order.orderDetails && order.orderDetails.length > 0 ? (
                order.orderDetails.map((detail, index) => (
                  <div key={detail.id || index} className="order-details-product">
                    <div className="order-details-product-info">
                      <div className="order-details-product-number">{index + 1}</div>
                      <div className="order-details-product-details">
                        <p className="order-details-product-name">
                          {detail.productName || 'Producto sin nombre'}
                        </p>
                        <div className="order-details-product-meta">
                          <span className="order-details-product-quantity">
                            Cantidad: <strong>{detail.quantity || 0}</strong>
                          </span>
                          <span className="order-details-product-price">
                            Precio unitario: <strong>{formatCurrency(detail.price || 0)}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="order-details-product-subtotal">
                      {formatCurrency(detail.subtotal || 0)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="order-details-empty">No hay productos en este pedido</p>
              )}
            </div>
          </section>

          {/* Resumen */}
          <section className="order-details-section order-details-summary">
            <div className="order-details-summary-row">
              <span className="order-details-summary-label">Total de items:</span>
              <span className="order-details-summary-value">
                {order.totalItems || order.orderDetails?.length || 0}
              </span>
            </div>
            <div className="order-details-summary-row order-details-summary-row--total">
              <span className="order-details-summary-label">Total del pedido:</span>
              <span className="order-details-summary-value order-details-summary-value--total">
                {formatCurrency(order.totalAmount || 0)}
              </span>
            </div>
          </section>
        </div>

        <div className="order-details-footer">
          <button className="order-details-close-btn" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;

