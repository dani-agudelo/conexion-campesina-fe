const LoginForm = ({ onSubmit }) => {
  const handleSubmit = (formData) => {

    const email = formData.get('email');
    const password = formData.get('password');

    onSubmit?.({ email, password })

  };

  return (
    <>
      <h1 className="login-title">Bienvenido de nuevo</h1>
      <p className="login-subtitle">Inicia sesión para acceder a tu cuenta.</p>

      <form className="login-form" action={handleSubmit}>
        <label className="field-label" htmlFor="email">Nombre de usuario o correo</label>
        <input className="text-input" id="email" name="email" type="email" placeholder="tu@email.com" />

        <label className="field-label" htmlFor="password">Contraseña</label>
        <input className="text-input" id="password" name="password" type="password" placeholder="********" />

        <div className="form-row">
          <label className="remember">
            <input type="checkbox" />
            <span>Recordarme</span>
          </label>
          <a className="link" href="#">¿Olvidaste tu contraseña?</a>
        </div>

        <button className="primary-button" type="submit">Iniciar Sesión</button>
      </form>

      <p className="register-text">
        ¿No tienes una cuenta?
        <a className="link" href="/registro"> Regístrate</a>
      </p>
    </>
  );
};

export { LoginForm };

