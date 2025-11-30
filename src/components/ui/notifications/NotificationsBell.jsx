import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../../../state/notifications';
import { useNotificationsStream } from '../../../hooks/useNotificationsStream';
import { BellIcon } from '../../icons';
import './NotificationsBell.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0);

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  
  return date.toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const NotificationsBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Conectar al stream de notificaciones
  useNotificationsStream();

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  const renderNotificationContent = (notification) => {
    const { type, data } = notification;

    if (type === 'NEW_ORDER') {
      return (
        <div className="notification-content">
          <div className="notification-header">
            <span className="notification-type-badge notification-type-badge--order">
              Nuevo Pedido
            </span>
            <span className="notification-time">{formatDate(notification.timestamp)}</span>
          </div>
          <div className="notification-body">
            <p className="notification-title">Pedido #{data.orderId?.slice(0, 8) || 'N/A'}</p>
            <p className="notification-text">
              Cliente: <strong>{data.clientName || 'Cliente'}</strong>
            </p>
            <p className="notification-text">
              Total: <strong>{formatCurrency(data.totalAmount)}</strong>
            </p>
            <p className="notification-text">
              {data.productCount || 0} producto{data.productCount !== 1 ? 's' : ''}
            </p>
            {data.address && (
              <p className="notification-text notification-address">
                📍 {data.address}
              </p>
            )}
          </div>
        </div>
      );
    }

    if (type === 'LOW_STOCK') {
      return (
        <div className="notification-content">
          <div className="notification-header">
            <span className="notification-type-badge notification-type-badge--stock">
              Stock Bajo
            </span>
            <span className="notification-time">{formatDate(notification.timestamp)}</span>
          </div>
          <div className="notification-body">
            <p className="notification-title">Alerta de Inventario</p>
            <p className="notification-text">
              Cantidad disponible: <strong>{data.available_quantity || 0}</strong>
            </p>
            <p className="notification-text">
              Umbral mínimo: <strong>{data.minimum_threshold || 0}</strong>
            </p>
            <p className="notification-text notification-warning">
              ⚠️ El stock está por debajo del mínimo configurado
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="notifications-bell-wrapper" ref={dropdownRef}>
      <button
        className="notifications-bell"
        onClick={handleToggle}
        aria-label="Notificaciones"
        title="Notificaciones"
      >
        <BellIcon size={22} />
        {unreadCount > 0 && (
          <span className="notifications-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notifications-dropdown">
          <div className="notifications-dropdown-header">
            <h3>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                className="mark-all-read-btn"
                onClick={markAllAsRead}
              >
                Marcar todas como leídas
              </button>
            )}
          </div>

          <div className="notifications-list">
            {notifications.length === 0 ? (
              <div className="notifications-empty">
                <p>No tienes notificaciones</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${!notification.read ? 'notification-item--unread' : ''}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  {renderNotificationContent(notification)}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;

