import React, { useState } from 'react';
import './AddressModal.css';

const AddressModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    department: '',
    postalCode: '',
    additionalInfo: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'El nombre completo es requerido';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'El teléfono es requerido';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Ingresa un teléfono válido de 10 dígitos';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es requerida';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'El departamento es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      onSave(formData);
      handleClose();
    } catch (error) {
      console.error('Error saving address:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        department: '',
        postalCode: '',
        additionalInfo: ''
      });
      setErrors({});
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  const departments = [
    'Amazonas', 'Antioquia', 'Arauca', 'Atlántico', 'Bolívar', 'Boyacá',
    'Caldas', 'Caquetá', 'Casanare', 'Cauca', 'Cesar', 'Chocó', 'Córdoba',
    'Cundinamarca', 'Guainía', 'Guaviare', 'Huila', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Putumayo', 'Quindío', 'Risaralda',
    'San Andrés y Providencia', 'Santander', 'Sucre', 'Tolima', 'Valle del Cauca',
    'Vaupés', 'Vichada'
  ];

  return (
    <div className="address-modal-overlay" onClick={handleOverlayClick}>
      <div className="address-modal" onClick={(e) => e.stopPropagation()}>
        <div className="address-modal__header">
          <h2 className="address-modal__title">
            Dirección de Envío
          </h2>
          <button
            className="address-modal__close-btn"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <div className="address-modal__content">
          <p className="address-modal__description">
            Completa la información de envío para procesar tu pedido.
          </p>

          <form onSubmit={handleSubmit} className="address-modal__form">
            <div className="address-modal__field">
              <label htmlFor="fullName" className="address-modal__label">
                Nombre Completo *
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`address-modal__input ${errors.fullName ? 'address-modal__input--error' : ''}`}
                placeholder="Ej: Juan Pérez García"
                disabled={isSubmitting}
              />
              {errors.fullName && (
                <span className="address-modal__error">{errors.fullName}</span>
              )}
            </div>

            <div className="address-modal__field">
              <label htmlFor="phone" className="address-modal__label">
                Teléfono *
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`address-modal__input ${errors.phone ? 'address-modal__input--error' : ''}`}
                placeholder="Ej: 3001234567"
                disabled={isSubmitting}
              />
              {errors.phone && (
                <span className="address-modal__error">{errors.phone}</span>
              )}
            </div>

            <div className="address-modal__field">
              <label htmlFor="address" className="address-modal__label">
                Dirección *
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`address-modal__input ${errors.address ? 'address-modal__input--error' : ''}`}
                placeholder="Ej: Calle 10 # 20-30"
                disabled={isSubmitting}
              />
              {errors.address && (
                <span className="address-modal__error">{errors.address}</span>
              )}
            </div>

            <div className="address-modal__row">
              <div className="address-modal__field address-modal__field--half">
                <label htmlFor="city" className="address-modal__label">
                  Ciudad *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={`address-modal__input ${errors.city ? 'address-modal__input--error' : ''}`}
                  placeholder="Ej: Medellín"
                  disabled={isSubmitting}
                />
                {errors.city && (
                  <span className="address-modal__error">{errors.city}</span>
                )}
              </div>

              <div className="address-modal__field address-modal__field--half">
                <label htmlFor="department" className="address-modal__label">
                  Departamento *
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                  className={`address-modal__select ${errors.department ? 'address-modal__select--error' : ''}`}
                  disabled={isSubmitting}
                >
                  <option value="">Seleccionar</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <span className="address-modal__error">{errors.department}</span>
                )}
              </div>
            </div>

            <div className="address-modal__field">
              <label htmlFor="postalCode" className="address-modal__label">
                Código Postal
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="address-modal__input"
                placeholder="Ej: 050001"
                disabled={isSubmitting}
              />
            </div>

            <div className="address-modal__field">
              <label htmlFor="additionalInfo" className="address-modal__label">
                Información Adicional
              </label>
              <textarea
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleInputChange}
                className="address-modal__textarea"
                placeholder="Ej: Casa color blanca, al lado de la panadería"
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="address-modal__actions">
              <button
                type="button"
                className="address-modal__cancel-btn"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="address-modal__save-btn"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="address-modal__spinner"></span>
                    Guardando...
                  </>
                ) : (
                  'Confirmar y Continuar'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;