import "./InventoryForm.css";
import { useState } from "react";
import { UNITS } from "../../../types/enums";

const InventoryForm = ({ onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    quantity: "",
    unit: "",
    minThreshold: "",
    maxCapacity: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.quantity || formData.quantity <= 0) newErrors.quantity = "Cantidad requerida mayor a 0";
    if (!formData.unit) newErrors.unit = "Unidad requerida";
    if (!formData.minThreshold || formData.minThreshold < 0) newErrors.minThreshold = "Umbral requerido";
    if (!formData.maxCapacity || formData.maxCapacity <= 0) newErrors.maxCapacity = "Capacidad requerida";

    if (Number(formData.minThreshold) >= Number(formData.maxCapacity)) {
      newErrors.minThreshold = "El mínimo debe ser menor a la capacidad";
    }

    if (Number(formData.quantity) > Number(formData.maxCapacity)) {
      newErrors.quantity = "La cantidad excede la capacidad máxima";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      quantity: Number(formData.quantity),
      unit: formData.unit,
      minThreshold: Number(formData.minThreshold),
      maxCapacity: Number(formData.maxCapacity),
    });
  };

  return (
    <div className="product-form-overlay">
      <div className="product-form inventory-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-form__header">
          <h2 className="product-form__title">Crear Inventario</h2>
          <button className="product-form__close-btn" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form__content">
          <div className="inventory-grid">

            <div className="product-form__field">
              <label className="product-form__label">Cantidad Disponible</label>
              <input
                type="number"
                name="quantity"
                className={`product-form__input ${errors.quantity ? "product-form__input--error" : ""}`}
                placeholder="Ej: 100"
                value={formData.quantity}
                onChange={handleInputChange}
              />
              {errors.quantity && <span className="product-form__error">{errors.quantity}</span>}
            </div>

            <div className="product-form__field">
              <label className="product-form__label">Unidad</label>
              <select
                name="unit"
                className={`product-form__select ${errors.unit ? "product-form__select--error" : ""}`}
                value={formData.unit}
                onChange={handleInputChange}
              >
                <option value="">Seleccionar unidad</option>
                {UNITS.map((u) => (
                  <option key={u.value} value={u.value}>{u.label}</option>
                ))}
              </select>
              {errors.unit && <span className="product-form__error">{errors.unit}</span>}
            </div>

            <div className="product-form__field">
              <label className="product-form__label">Umbral Mínimo</label>
              <input
                type="number"
                name="minThreshold"
                className={`product-form__input ${errors.minThreshold ? "product-form__input--error" : ""}`}
                placeholder="Ej: 10"
                value={formData.minThreshold}
                onChange={handleInputChange}
              />
              <small className="product-form__hint">Alerta para bajas existencias.</small>
              {errors.minThreshold && <span className="product-form__error">{errors.minThreshold}</span>}
            </div>

            <div className="product-form__field">
              <label className="product-form__label">Capacidad Máxima</label>
              <input
                type="number"
                name="maxCapacity"
                className={`product-form__input ${errors.maxCapacity ? "product-form__input--error" : ""}`}
                placeholder="Ej: 500"
                value={formData.maxCapacity}
                onChange={handleInputChange}
              />
              <small className="product-form__hint">Límite total de stock.</small>
              {errors.maxCapacity && <span className="product-form__error">{errors.maxCapacity}</span>}
            </div>
          </div>

          <div className="product-form__actions">
            <button type="button" className="product-form__cancel-btn" onClick={onCancel}>
              Cancelar
            </button>
            <button type="submit" className="product-form__save-btn">
              Guardar Inventario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;