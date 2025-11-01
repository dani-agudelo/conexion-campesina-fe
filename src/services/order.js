/**
 * Servicio para gestión de productos
 * Maneja las llamadas al backend para CRUD de productos
 */

const API_URL = import.meta.env.VITE_API_URL;

export const orderService = {
  /**
   * Obtener todos los productos disponibles en el catálogo
   * (Para que el productor seleccione qué productos ofrecer)
   */
  // Obtener todas las órdenes (solo admin)
  getAllOrders: async () => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener órdenes');
      return await response.json();
    } catch (error) {
      console.error('Error en getAllOrders:', error);
      throw error;
    }
  },

  /**
   * Obtener los productos publicados por un productor específico
   */
  // Obtener una orden por ID
  getOrderById: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener la orden');
      return await response.json();
    } catch (error) {
      console.error('Error en getOrderById:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto para el productor
   */
  // Crear una nueva orden
  createOrder: async (orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Error al crear la orden');
      return await response.json();
    } catch (error) {
      console.error('Error en createOrder:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto existente del productor
   */
  // Actualizar una orden
  updateOrder: async (orderId, orderData) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error('Error al actualizar la orden');
      return await response.json();
    } catch (error) {
      console.error('Error en updateOrder:', error);
      throw error;
    }
  },

  /**
   * Eliminar un producto del productor
   */
  // Eliminar una orden
  deleteOrder: async (orderId) => {
    try {
      const response = await fetch(`${API_URL}/orders/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al eliminar la orden');
      return await response.json();
    } catch (error) {
      console.error('Error en deleteOrder:', error);
      throw error;
    }
  },
  // Obtener órdenes por cliente
  getOrdersByClientId: async (clientId) => {
    try {
      const response = await fetch(`${API_URL}/orders/client/${clientId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!response.ok) throw new Error('Error al obtener órdenes del cliente');
      return await response.json();
    } catch (error) {
      console.error('Error en getOrdersByClientId:', error);
      throw error;
    }
  },
};

