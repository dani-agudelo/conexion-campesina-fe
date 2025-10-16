/**
 * Servicio para gestión de productos
 * Maneja las llamadas al backend para CRUD de productos
 */

const API_URL = import.meta.env.VITE_API_URL;

export const productService = {
  /**
   * Obtener todos los productos disponibles en el catálogo
   * (Para que el productor seleccione qué productos ofrecer)
   */
  getAllProducts: async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) throw new Error('Error al obtener productos');
      return await response.json();
    } catch (error) {
      console.error('Error en getAllProducts:', error);
      throw error;
    }
  },

  /**
   * Obtener los productos publicados por un productor específico
   */
  getProducerProducts: async (producerId) => {
    try {
      const response = await fetch(`${API_URL}/producer/${producerId}/products`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Error al obtener productos del productor');
      return await response.json();
    } catch (error) {
      console.error('Error en getProducerProducts:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto para el productor
   */
  createProducerProduct: async (productData) => {
    try {
      const response = await fetch(`${API_URL}/producer/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) throw new Error('Error al crear producto');
      return await response.json();
    } catch (error) {
      console.error('Error en createProducerProduct:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto existente del productor
   */
  updateProducerProduct: async (productId, productData) => {
    try {
      const response = await fetch(`${API_URL}/producer/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(productData),
      });
      
      if (!response.ok) throw new Error('Error al actualizar producto');
      return await response.json();
    } catch (error) {
      console.error('Error en updateProducerProduct:', error);
      throw error;
    }
  },

  /**
   * Eliminar un producto del productor
   */
  deleteProducerProduct: async (productId) => {
    try {
      const response = await fetch(`${API_URL}/producer/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) throw new Error('Error al eliminar producto');
      return await response.json();
    } catch (error) {
      console.error('Error en deleteProducerProduct:', error);
      throw error;
    }
  },
};

