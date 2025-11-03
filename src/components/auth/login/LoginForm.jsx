import './LoginForm.css';
import { useForm } from 'react-hook-form';

const LoginForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const onFormSubmit = (data) => {
    onSubmit?.({ email: data.email, password: data.password });
  };

  return (
    <>
      <h1 className="login-title">Bienvenido de nuevo</h1>
      <p className="login-subtitle">Inicia sesión para acceder a tu cuenta.</p>

      <form className="login-form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
        <label className="field-label" htmlFor="email">Nombre de usuario o correo</label>
        <input
          className={`text-input ${errors.email ? 'input-error' : ''}`}
          id="email"
          type="email"
          autoComplete='username'
          placeholder="tu@email.com"
          aria-invalid={errors.email ? "true" : "false"}
          {...register('email', {
            required: 'El correo es obligatorio',
            pattern: {
              value: /^\S+@\S+$/i,
              message: 'Ingresa un correo electrónico válido'
            }
          })}
        />

        {errors.email && <span className="error-message">{errors.email.message}</span>}

        <label className="field-label" htmlFor="password">Contraseña</label>
        <input
          className={`text-input ${errors.password ? 'input-error' : ''}`}
          id="password"
          type="password"
          autoComplete='current-password'
          placeholder="********"
          aria-invalid={errors.password ? "true" : "false"}
          {...register('password', {
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

        <div className="form-row">
          <label className="remember">
            <input
              type="checkbox"
              {...register('rememberMe')}
            />
            <span>Recordarme</span>
          </label>
          <a className="link" href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button className="primary-button" type="submit">Iniciar Sesión</button>
      </form>

      <p className="register-text">
        ¿No tienes una cuenta?
        <a className="link" href="/register"> Regístrate</a>
      </p>
    </>
  );
};

export { LoginForm };
