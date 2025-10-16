import { useState } from 'react';

const RegisterForm = ({ onSubmit }) => {
  const [accountType, setAccountType] = useState('consumer');

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(e, accountType);
    }
  };

  return (
    <>
      <h1 className="register-title">Crea tu cuenta</h1>
      
      <div className="account-type-selector">
        <button 
          className={`type-button ${accountType === 'consumer' ? 'active' : ''}`}
          type="button"
          onClick={() => handleAccountTypeChange('consumer')}
        >
          Consumidor
        </button>
        <button 
          className={`type-button ${accountType === 'producer' ? 'active' : ''}`}
          type="button"
          onClick={() => handleAccountTypeChange('producer')}
        >
          Productor
        </button>
      </div>

      <form className="register-form" onSubmit={handleSubmit}>
        <input 
          className="text-input" 
          type="text" 
          placeholder="Nombre completo" 
          required 
        />
        <input 
          className="text-input" 
          type="email" 
          placeholder="Correo electrónico" 
          required 
        />
        <input 
          className="text-input" 
          type="password" 
          placeholder="Contraseña" 
          required 
        />
        <input 
          className="text-input" 
          type="password" 
          placeholder="Confirmar contraseña" 
          required 
        />
        
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

