import React, { useState, useEffect } from "react";
import "./ProductForm.css";
import { useProductBaseQuery } from "../../../hooks/query/useProductBase";
import { UNITS } from '../../../types/enums';

const ProductForm = ({ product, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    productBaseId: "",
    name: "",
    description: "",
    price: "",
    quantity: "1",
    unit: "KILOGRAMO",
    imageUrl: "",
    isAvailable: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: productBases, isLoading: loadingBases, error: errorBases } = useProductBaseQuery();

  useEffect(() => {
    if (product) {
      setFormData({
        productBaseId: product.productBaseId || "",
        name: product.name || "",
        description: product.description || "",
        price: product.price || "",
        quantity: product.quantity || "1",
        unit: product.unit || "KILOGRAMO",
        imageUrl: product.imageUrl || "",
        isAvailable: product.isAvailable ?? true,
      });
    }
  }, [product]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productBaseId) {
      newErrors.productBaseId = "Debes seleccionar un tipo de producto";
    }

    if (!formData.name.trim()) {
      newErrors.name = "El nombre del producto es requerido";
    }

    if (!formData.description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (formData.description.length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "La cantidad debe ser mayor a 0";
    }

    if (!formData.unit) {
      newErrors.unit = "Debes seleccionar una unidad";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "El link de imagen es requerido";
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Ingresa una URL válida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch {
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
      const productData = {
        productBaseId: formData.productBaseId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        unit: formData.unit,
        quantity: parseFloat(formData.quantity),
        imageUrl: formData.imageUrl || undefined,
        isAvailable: formData.isAvailable,
      };

      Object.keys(productData).forEach(
        (key) => productData[key] === undefined && delete productData[key]
      );

      onSave(productData);
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  // Función para obtener el nombre de la unidad
  const getUnitLabel = (unit, quantity) => {
    const unitLabels = {
      KILOGRAMO: quantity > 1 ? 'kilogramos' : 'kilogramo',
      GRAMO: quantity > 1 ? 'gramos' : 'gramo',
      LITRO: quantity > 1 ? 'litros' : 'litro',
      MILILITRO: quantity > 1 ? 'mililitros' : 'mililitro',
      LIBRA: quantity > 1 ? 'libras' : 'libra',
      UNIDAD: quantity > 1 ? 'unidades' : 'unidad',
      DOCENA: quantity > 1 ? 'docenas' : 'docena',
      MANOJO: quantity > 1 ? 'manojos' : 'manojo',
      ATADO: quantity > 1 ? 'atados' : 'atado',
      BULTO: quantity > 1 ? 'bultos' : 'bulto',
      SACO: quantity > 1 ? 'sacos' : 'saco',
      CAJA: quantity > 1 ? 'cajas' : 'caja',
      CANASTA: quantity > 1 ? 'canastas' : 'canasta',
    };
    return unitLabels[unit] || unit.toLowerCase();
  };

  // Calcular cuántas ventas equivalen a 1kg de inventario
  const calculateInventoryImpact = () => {
    const qty = parseFloat(formData.quantity) || 0;
    const unit = formData.unit;

    let gramsPerSale = 0;

    switch (unit) {
      case 'KILOGRAMO':
        gramsPerSale = qty * 1000;
        break;
      case 'GRAMO':
        gramsPerSale = qty;
        break;
      case 'LIBRA':
        gramsPerSale = qty * 500;
        break;
      case 'LITRO':
        gramsPerSale = qty * 1000;
        break;
      case 'MILILITRO':
        gramsPerSale = qty;
        break;
      default:
        return null;
    }

    if (gramsPerSale === 0) return null;

    const salesPerKilo = (1000 / gramsPerSale).toFixed(2);
    return salesPerKilo;
  };

  const salesPerKilo = calculateInventoryImpact();

  return (
    <div className="product-form-overlay" onClick={handleClose}>
      <div className="product-form" onClick={(e) => e.stopPropagation()}>
        <div className="product-form__header">
          <h2 className="product-form__title">
            {product ? "Editar Producto" : "Agregar Nuevo Producto"}
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
              ? "Modifica la información de tu producto"
              : "Completa el formulario para poner a la venta un nuevo producto de tu cosecha."}
          </p>

          <form onSubmit={handleSubmit} className="product-form__form">
            {/* === SECCIÓN 1: INFORMACIÓN GENERAL === */}
            <div className="product-form__section">
              <div className="product-form__section-header">
                <h3 className="product-form__section-title">Información General</h3>
              </div>

              <div className="product-form__field">
                <label htmlFor="productBaseId" className="product-form__label">
                  Tipo de Producto *
                </label>
                <select
                  id="productBaseId"
                  name="productBaseId"
                  value={formData.productBaseId}
                  onChange={handleInputChange}
                  className={`product-form__select ${errors.productBaseId ? "product-form__select--error" : ""}`}
                  disabled={isSubmitting || loadingBases}
                >
                  <option value="">
                    {loadingBases ? "Cargando productos..." : "Selecciona un producto"}
                  </option>
                  {productBases?.map((base) => (
                    <option key={base.id} value={base.id}>
                      {base.name} - {base.category}
                    </option>
                  ))}
                </select>
                {errors.productBaseId && (
                  <span className="product-form__error">{errors.productBaseId}</span>
                )}
                {errorBases && (
                  <span className="product-form__error">Error al cargar productos base</span>
                )}
                <small className="product-form__hint">
                  Selecciona el tipo de producto que vas a ofrecer
                </small>
              </div>

              <div className="product-form__field">
                <label htmlFor="name" className="product-form__label">
                  Nombre de tu oferta *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`product-form__input ${errors.name ? "product-form__input--error" : ""}`}
                  placeholder="Ej: Tomate Orgánico Chonto - Finca La Esperanza"
                  disabled={isSubmitting}
                />
                {errors.name && (
                  <span className="product-form__error">{errors.name}</span>
                )}
                <small className="product-form__hint">
                  Dale un nombre único a tu oferta para diferenciarte
                </small>
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
                  className={`product-form__textarea ${errors.description ? "product-form__textarea--error" : ""}`}
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
                  Link de imagen *
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className={`product-form__input ${errors.imageUrl ? "product-form__input--error" : ""}`}
                  placeholder="https://ejemplo.com/imagen.jpg"
                  disabled={isSubmitting}
                />
                {errors.imageUrl && (
                  <span className="product-form__error">{errors.imageUrl}</span>
                )}
              </div>
            </div>

            {/* === SECCIÓN 2: PRESENTACIÓN DE VENTA === */}
            <div className="product-form__section">
              <div className="product-form__section-header">
                <h3 className="product-form__section-title">Presentación de Venta</h3>
              </div>
              <p className="product-form__section-description">
                Define cómo verá el cliente tu producto en la tienda
              </p>

              <div className="product-form__row">
                <div className="product-form__field product-form__field--half">
                  <label htmlFor="quantity" className="product-form__label">
                    Cantidad por venta *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    className={`product-form__input ${errors.quantity ? "product-form__input--error" : ""}`}
                    placeholder="Ej: 1"
                    step="0.01"
                    min="0.01"
                    disabled={isSubmitting}
                  />
                  {errors.quantity && (
                    <span className="product-form__error">{errors.quantity}</span>
                  )}
                  <small className="product-form__hint">
                    ¿Cuántas unidades vendes por cada compra?
                  </small>
                </div>

                <div className="product-form__field product-form__field--half">
                  <label htmlFor="unit" className="product-form__label">
                    Unidad *
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    className={`product-form__select ${errors.unit ? "product-form__select--error" : ""}`}
                    disabled={isSubmitting}
                  >
                    <option value="">Selecciona unidad</option>
                    {UNITS.map((u) => (
                      <option key={u.value} value={u.value}>
                        {u.label}
                      </option>
                    ))}
                  </select>
                  {errors.unit && (
                    <span className="product-form__error">{errors.unit}</span>
                  )}
                  <small className="product-form__hint">
                    ¿En qué unidad se mide?
                  </small>
                </div>
              </div>

              <div className="product-form__row">
                <div className="product-form__field">
                  <label htmlFor="price" className="product-form__label">
                    Precio ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`product-form__input ${errors.price ? "product-form__input--error" : ""}`}
                    placeholder="Ej: 5000"
                    step="0.01"
                    min="0.01"
                    disabled={isSubmitting}
                  />
                  {errors.price && (
                    <span className="product-form__error">{errors.price}</span>
                  )}
                  <small className="product-form__hint">
                    Precio por la presentación configurada arriba
                  </small>
                </div>
              </div>

              {/* Vista previa DEBAJO del precio */}
              {formData.quantity && formData.unit && formData.name && (
                <div className="product-form__unit-info">
                  📢 <strong>Vista previa:</strong> Vendes <strong>{formData.quantity} {getUnitLabel(formData.unit, parseFloat(formData.quantity))}</strong> de <strong>{formData.name || 'tu producto'}</strong>{formData.price ? ` por ${parseFloat(formData.price).toLocaleString('es-CO')}` : ''}
                  {salesPerKilo && (
                    <div style={{ marginTop: '4px', fontStyle: 'italic', color: '#059669' }}>
                      💡 Se descontará 1 kg de inventario cada {salesPerKilo} venta{parseFloat(salesPerKilo) > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              )}
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
                disabled={isSubmitting || loadingBases}
              >
                {isSubmitting ? (
                  <>
                    <span className="product-form__spinner"></span>
                    Guardando...
                  </>
                ) : (
                  "Guardar Producto"
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