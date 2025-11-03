import './RegisterForm.css'
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserRole } from '../../../types/enums'

const RegisterForm = ({ onSubmit }) => {
  const [accountType, setAccountType] = useState(UserRole.CLIENT);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset
  } = useForm();

  // Cambio de contraseña
  const password = useRef({});
  password.current = watch("password", "");

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
  };

  const onFormSubmit = (data) => {
    const payload = {
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      role: accountType
    };

    onSubmit?.(payload);

    reset();
  };

  return (
    <>
      <h1 className="register-title">Crea tu cuenta</h1>

      <div className="account-type-selector">
        <button
          className={`type-button ${accountType === UserRole.CLIENT ? 'active' : ''}`}
          type="button"
          onClick={() => handleAccountTypeChange(UserRole.CLIENT)}
        >
          Consumidor
        </button>
        <button
          className={`type-button ${accountType === UserRole.PRODUCER ? 'active' : ''}`}
          type="button"
          onClick={() => handleAccountTypeChange(UserRole.PRODUCER)}
        >
          Productor
        </button>
      </div>

      <form className="register-form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <input
          className={`text-input ${errors.fullName ? 'input-error' : ''}`}
          type="text"
          placeholder="Nombre completo"
          aria-invalid={errors.fullName ? "true" : "false"}
          {...register('fullName', {
            required: 'El nombre completo es obligatorio'
          })}
        />

        {errors.fullName && <span className="error-message">{errors.fullName.message}</span>}

        <input
          className={`text-input ${errors.email ? 'input-error' : ''}`}
          type="email"
          autoComplete='username'
          placeholder="Correo electrónico"
          aria-invalid={errors.email ? "true" : "false"}
          {...register('email', {
            required: 'El correo electrónico es obligatorio',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Ingresa un correo electrónico válido'
            }
          })}
        />
        {errors.email && <span className="error-message">{errors.email.message}</span>}

        <input
          className={`text-input ${errors.password ? 'input-error' : ''}`}
          type="password"
          placeholder="Contraseña"
          autoComplete='new-password'
          aria-invalid={errors.password ? "true" : "false"}
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: {
              value: 8,
              message: 'La contraseña debe tener al menos 8 caracteres'
            },
            validate: {
              hasLower: value => /[a-z]/.test(value) || "Debe incluir al menos una minúscula",
              hasUpper: value => /[A-Z]/.test(value) || "Debe incluir al menos una mayúscula",
              hasNumber: value => /\d/.test(value) || "Debe incluir al menos un número",
            },
          })}
        />

        {errors.password && <span className="error-message">{errors.password.message}</span>}

        <input
          className={`text-input ${errors.confirmPassword ? 'input-error' : ''}`}
          type="password"
          autoComplete='new-password'
          placeholder="Confirmar contraseña"
          aria-invalid={errors.confirmPassword ? "true" : "false"}
          {...register('confirmPassword', {
            required: 'Debes confirmar tu contraseña',
            validate: (value) =>
              value === password.current || 'Las contraseñas no coinciden'
          })}
        />
        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword.message}</span>}

        <button className="register-button" type="submit">
          Registrarse
        </button>
      </form>

      <p className="disclaimer">
        Al registrarte, aceptas nuestros{' '}
        <a href="#" className="disclaimer-link">Términos de servicio</a>
        {' '}y{' '}
        <a href="#" className="disclaimer-link">Política de privacidad</a>.
      </p>
    </>
  );
};

export { RegisterForm };
