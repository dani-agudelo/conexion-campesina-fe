import React, { useState, useEffect } from 'react';
import './ProductForm.css';

const ProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    category: 'vegetales',
    imageUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        quantity: product.quantity || '',
        unit: product.unit || 'kg',
        category: product.category || 'vegetales',
        imageUrl: product.imageUrl || ''
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del producto es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    } else if (formData.description.length < 10) {
      newErrors.description = 'La descripción debe tener al menos 10 caracteres';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0';
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = 'La cantidad debe ser mayor a 0';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Ingresa una URL válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simular delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      onSave(productData);
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  const categories = [
    { value: 'vegetales', label: 'Vegetales' },
    { value: 'frutas', label: 'Frutas' },
    { value: 'proteinas', label: 'Proteínas' },
    { value: 'lacteos', label: 'Lácteos' },
    { value: 'granos', label: 'Granos' },
    { value: 'hierbas', label: 'Hierbas' },
    { value: 'otros', label: 'Otros' }
  ];

  const units = [
    { value: 'kg', label: 'Kilogramo (kg)' },
    { value: 'g', label: 'Gramo (g)' },
    { value: 'unidad', label: 'Unidad' },
    { value: 'docena', label: 'Docena' },
    { value: 'libra', label: 'Libra' },
    { value: 'litro', label: 'Litro' },
    { value: 'ml', label: 'Mililitro (ml)' },
    { value: 'frasco', label: 'Frasco' },
    { value: 'bolsa', label: 'Bolsa' }
  ];

  return (
    <div className="product-form-overlay" onClick={handleClose}>
      <div className="product-form" onClick={(e) => e.stopPropagation()}>
        <div className="product-form__header">
          <h2 className="product-form__title">
            {product ? 'Editar Producto' : 'Agregar Nuevo Producto'}
          </h2>
          <button
            className="product-form__close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="product-form__content">
          <p className="product-form__description">
            {product 
              ? 'Modifica la información de tu producto'
              : 'Completa el formulario para poner a la venta un nuevo producto de tu cosecha.'
            }
          </p>

          <form onSubmit={handleSubmit} className="product-form__form">
            <div className="product-form__field">
              <label htmlFor="name" className="product-form__label">
                Nombre del Producto *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={`product-form__input ${errors.name ? 'product-form__input--error' : ''}`}
                placeholder="Ej: Tomates orgánicos"
                disabled={isSubmitting}
              />
              {errors.name && (
                <span className="product-form__error">{errors.name}</span>
              )}
            </div>

            <div className="product-form__field">
              <label htmlFor="category" className="product-form__label">
                Categoría *
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="product-form__select"
                disabled={isSubmitting}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="product-form__field">
              <label htmlFor="description" className="product-form__label">
                Descripción *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className={`product-form__textarea ${errors.description ? 'product-form__textarea--error' : ''}`}
                placeholder="Ej: Tomates frescos, cultivados sin pesticidas. Perfectos para ensaladas."
                rows={4}
                disabled={isSubmitting}
              />
              {errors.description && (
                <span className="product-form__error">{errors.description}</span>
              )}
            </div>

            <div className="product-form__field">
              <label htmlFor="imageUrl" className="product-form__label">
                Link de imagen
              </label>
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleInputChange}
                className={`product-form__input ${errors.imageUrl ? 'product-form__input--error' : ''}`}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={isSubmitting}
              />
              {errors.imageUrl && (
                <span className="product-form__error">{errors.imageUrl}</span>
              )}
            </div>

            <div className="product-form__row">
              <div className="product-form__field product-form__field--half">
                <label htmlFor="price" className="product-form__label">
                  Precio (COP) *
                </label>
                <div className="product-form__input-group">
                  <span className="product-form__input-prefix">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`product-form__input ${errors.price ? 'product-form__input--error' : ''}`}
                    placeholder="2500"
                    min="0"
                    step="100"
                    disabled={isSubmitting}
                  />
                  <span className="product-form__input-suffix">COP</span>
                </div>
                {errors.price && (
                  <span className="product-form__error">{errors.price}</span>
                )}
              </div>

              <div className="product-form__field product-form__field--half">
                <label htmlFor="quantity" className="product-form__label">
                  Cantidad disponible *
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className={`product-form__input ${errors.quantity ? 'product-form__input--error' : ''}`}
                  placeholder="50"
                  min="1"
                  disabled={isSubmitting}
                />
                {errors.quantity && (
                  <span className="product-form__error">{errors.quantity}</span>
                )}
              </div>
            </div>

            <div className="product-form__field">
              <label htmlFor="unit" className="product-form__label">
                Unidad de medida *
              </label>
              <select
                id="unit"
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="product-form__select"
                disabled={isSubmitting}
              >
                {units.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="product-form__actions">
              <button
                type="button"
                className="product-form__cancel-btn"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="product-form__save-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="product-form__spinner"></span>
                    Guardando...
                  </>
                ) : (
                  'Guardar Producto'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
