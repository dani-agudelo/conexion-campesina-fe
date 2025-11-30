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
    quantity: "",
    unit: "KILOGRAMO",
    imageUrl: "",
    isAvailable: true,
    saleUnit: "",
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
        unit: product.unit || "KILOGRAMO",
        imageUrl: product.imageUrl || "",
        isAvailable: product.isAvailable ?? true,
        saleUnit: product.saleUnit || "",  // ← FALTABA
      });
    }
  }, [product]);


  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
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
      newErrors.description =
        "La descripción debe tener al menos 10 caracteres";
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = "El precio debe ser mayor a 0";
    }

    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = "El link de imagen es requerido";
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = "Ingresa una URL válida";
    }

    if (!formData.saleUnit) {
      newErrors.saleUnit = "Debes seleccionar la presentación de venta";
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
      let finalUnit = "GRAMO";
      let finalQuantity = 1;

      switch (formData.saleUnit) {

        // --- TUS OPCIONES ACTUALES ---
        case "KILOGRAMO":
          finalUnit = "KILOGRAMO";
          finalQuantity = 1;
          break;

        case "LIBRA":
          finalUnit = "GRAMO";
          finalQuantity = 500; // equivalente a media libra
          break;

        case "GR_500":
          finalUnit = "GRAMO";
          finalQuantity = 500;
          break;

        case "GR_250":
          finalUnit = "GRAMO";
          finalQuantity = 250;
          break;


        // --- NUEVAS OPCIONES PROPUESTAS ---

        // 🍶 Litro
        case "LITRO":
          finalUnit = "LITRO";
          finalQuantity = 1;
          break;

        // 🥤 Medio litro (500 ml)
        case "ML_500":
          finalUnit = "MILILITRO";
          finalQuantity = 500;
          break;

        // 🥤 Cuarto de litro (250 ml)
        case "ML_250":
          finalUnit = "MILILITRO";
          finalQuantity = 250;
          break;

        // 🥚 Docena
        case "DOCENA":
          finalUnit = "UNIDAD";
          finalQuantity = 12;
          break;

        // 🥚 Unidad (para huevos, frutas grandes, etc.)
        case "UNIDAD":
          finalUnit = "UNIDAD";
          finalQuantity = 1;
          break;

        // 🍌 Manojo / atado
        case "MANOJO":
          finalUnit = "UNIDAD";
          finalQuantity = 1;
          break;

        // 🧅 Bulto de 5kg
        case "BULTO_5KG":
          finalUnit = "KILOGRAMO";
          finalQuantity = 5;
          break;

        // 🧅 Bulto de 10kg
        case "BULTO_10KG":
          finalUnit = "KILOGRAMO";
          finalQuantity = 10;
          break;

        // 🥬 Canastilla (usualmente 20kg)
        case "CANASTILLA_20KG":
          finalUnit = "KILOGRAMO";
          finalQuantity = 20;
          break;

        default:
          finalUnit = "GRAMO";
          finalQuantity = 1;
      }


      const productData = {
        productBaseId: formData.productBaseId,
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        unit: finalUnit,
        quantity: finalQuantity,
        imageUrl: formData.imageUrl || undefined,
        isAvailable: formData.isAvailable,
      };

      // Remover campos undefined
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
            {/* CAMPO ACTUALIZADO: ProductBase selector */}
            <div className="product-form__field">
              <label htmlFor="productBaseId" className="product-form__label">
                Tipo de Producto *
              </label>
              <select
                id="productBaseId"
                name="productBaseId"
                value={formData.productBaseId}
                onChange={handleInputChange}
                className={`product-form__select ${errors.productBaseId ? "product-form__select--error" : ""
                  }`}
                disabled={isSubmitting || loadingBases}
              >
                <option value="">
                  {loadingBases
                    ? "Cargando productos..."
                    : "Selecciona un producto"}
                </option>
                {productBases?.map((base) => (
                  <option key={base.id} value={base.id}>
                    {base.name} - {base.category}
                  </option>
                ))}
              </select>
              {errors.productBaseId && (
                <span className="product-form__error">
                  {errors.productBaseId}
                </span>
              )}
              {errorBases && (
                <span className="product-form__error">
                  Error al cargar productos base
                </span>
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
                className={`product-form__input ${errors.name ? "product-form__input--error" : ""
                  }`}
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
                className={`product-form__textarea ${errors.description ? "product-form__textarea--error" : ""
                  }`}
                placeholder="Ej: Tomates frescos, cultivados sin pesticidas. Perfectos para ensaladas."
                rows={4}
                disabled={isSubmitting}
              />
              {errors.description && (
                <span className="product-form__error">
                  {errors.description}
                </span>
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
                className={`product-form__input ${errors.imageUrl ? "product-form__input--error" : ""
                  }`}
                placeholder="https://ejemplo.com/imagen.jpg"
                disabled={isSubmitting}
              />
              {errors.imageUrl && (
                <span className="product-form__error">{errors.imageUrl}</span>
              )}
            </div>
            <div className="product-form__row">

              {/* ¿Cómo deseas vender este producto? */}
              <div className="product-form__field">
                <label htmlFor="saleUnit" className="product-form__label">
                  ¿Cómo deseas vender este producto? *
                </label>

                <select
                  id="saleUnit"
                  name="saleUnit"
                  value={formData.saleUnit}
                  onChange={handleInputChange}
                  className={`product-form__select ${errors.saleUnit ? "product-form__select--error" : ""}`}
                  disabled={isSubmitting}
                >
                  <option value="">Selecciona una opción</option>
                  <option value="KILOGRAMO">Por kilogramo (1 kg)</option>
                  <option value="LIBRA">Por libra (500 g)</option>
                  <option value="GR_500">Por bolsa de 500 gramos</option>
                  <option value="GR_250">Por bolsa de 250 gramos</option>
                  <option value="DOCENA">Por docena</option>
                  <option value="UNIDAD">Por unidad</option>
                  <option value="MANOJO">Por manojo</option>
                  <option value="BULTO_5KG">Por bulto (5 kg)</option>
                  <option value="BULTO_10KG">Por bulto (10 kg)</option>
                  <option value="CANASTILLA_20KG">Por canastilla (20 kg)</option>
                  <option value="LITRO">Por litro</option>
                  <option value="ML_500">Por 500 ml</option>
                  <option value="ML_250">Por 250 ml</option>
                </select>

                {errors.saleUnit && (
                  <span className="product-form__error">{errors.saleUnit}</span>
                )}

                <small className="product-form__hint">
                  Elige la presentación exacta con la que quieres vender este producto.
                </small>
              </div>


              {/* CAMPO 5B: Precio por Unidad de Venta (¡CORRECCIÓN AQUÍ!) */}
              <div className="product-form__field">
                <label htmlFor="price" className="product-form__label">
                  Precio por unidad de venta ($) *
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
                  Precio al público para la unidad que seleccionaste (ej: el precio de 1 kg).
                </small>
              </div>
            </div>

            <div className="product-form__field">
              <label className="product-form__checkbox-label">
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                <span>Producto disponible para la venta</span>
              </label>
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