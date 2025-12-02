import "./InventoryForm.css";
import { useState, useEffect } from "react";
import { UNITS } from "../../../types/enums";
import {
  useCreateInventoryMutation,
  useUpdateInventoryMutation
} from "../../../hooks/query/useProducerInventoryQuery";
import { showSuccessAlert, showErrorAlert } from "../../../utils/sweetAlert";

const InventoryForm = ({ productOfferId, editingItem, onClose }) => {
  const isEditing = !!editingItem;

  const [formData, setFormData] = useState({
    productOfferId: productOfferId,
    quantity: "",
    unit: "",
    minThreshold: "",
    maxCapacity: "",
  });

  const [errors, setErrors] = useState({});

  const createMutation = useCreateInventoryMutation();
  const updateMutation = useUpdateInventoryMutation();

  // Cargar datos si estamos editando
  useEffect(() => {
    if (editingItem) {
      setFormData({
        productOfferId: editingItem.productOfferId || "",
        quantity: editingItem.available || "",
        unit: editingItem.unit || "",
        minThreshold: editingItem.minThreshold || "",
        maxCapacity: editingItem.maxCapacity || "",
      });
    }
  }, [editingItem]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};

    if (!isEditing && !formData.productOfferId) {
      newErrors.productOfferId = "Producto requerido";
    }

    if (!formData.quantity || formData.quantity <= 0) {
      newErrors.quantity = "Cantidad requerida mayor a 0";
    }

    if (!isEditing && !formData.unit) {
      newErrors.unit = "Unidad requerida";
    }

    if (!formData.minThreshold || formData.minThreshold < 0) {
      newErrors.minThreshold = "Umbral requerido";
    }

    if (!formData.maxCapacity || formData.maxCapacity <= 0) {
      newErrors.maxCapacity = "Capacidad requerida";
    }

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

    if (isEditing) {
      // Actualizar inventario
      const updateData = {
        available_quantity: Number(formData.quantity),
        minimum_threshold: Number(formData.minThreshold),
        maximum_capacity: Number(formData.maxCapacity),
      };

      updateMutation.mutate(
        { id: editingItem.id, updateInventoryDto: updateData },
        {
          onSuccess: () => {
            showSuccessAlert("Inventario actualizado correctamente");
            onClose(true);
          },
          onError: (error) => {
            showErrorAlert(error?.message || "No se pudo actualizar el inventario");
          },
        }
      );
    } else {
      // Crear inventario
      const createData = {
        productOfferId: formData.productOfferId,
        available_quantity: Number(formData.quantity),
        unit: formData.unit,
        minimum_threshold: Number(formData.minThreshold),
        maximum_capacity: Number(formData.maxCapacity),
      };

      createMutation.mutate(createData, {
        onSuccess: () => {
          showSuccessAlert("Inventario creado correctamente");
          onClose(true);
        },
        onError: (error) => {
          showErrorAlert(error?.message || "No se pudo crear el inventario");
        },
      });
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="product-form-overlay" onClick={onClose}>
      <div className="product-form inventory-modal" onClick={(e) => e.stopPropagation()}>
        <div className="product-form__header">
          <h2 className="product-form__title">
            {isEditing ? "Editar Inventario" : "Crear Inventario"}
          </h2>
          <button className="product-form__close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="product-form__content">
          <div className="inventory-grid">


            {isEditing && (
              <div className="product-form__field product-form__field--full">
                <label className="product-form__label">Producto</label>
                <input
                  type="text"
                  className="product-form__input"
                  value={editingItem.name}
                  disabled
                />
                <small className="product-form__hint">No se puede cambiar el producto</small>
              </div>
            )}

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
              {isEditing ? (
                <>
                  <input
                    type="text"
                    className="product-form__input"
                    value={formData.unit}
                    disabled
                  />
                  <small className="product-form__hint">No se puede cambiar la unidad</small>
                </>
              ) : (
                <>
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
                </>
              )}
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
            <button
              type="button"
              className="product-form__cancel-btn"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="product-form__save-btn"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : isEditing ? "Actualizar Inventario" : "Guardar Inventario"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;