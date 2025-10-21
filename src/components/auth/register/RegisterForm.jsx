import { useState } from 'react';

const RegisterForm = ({ onSubmit }) => {
  const [accountType, setAccountType] = useState('CLIENT');

  const handleAccountTypeChange = (type) => {
    setAccountType(type);
  };

  const handleSubmit = (formData) => {
    const fullName =  formData.get('fullName')
    const email =  formData.get('email')
    const password =  formData.get('password')

    const payload = {
      fullName,
      email,
      password,
      role: accountType
    }

    onSubmit?.(payload)
  }

  return (
    <>
      <h1 className="register-title">Crea tu cuenta</h1>
      
      <div className="account-type-selector">
        <button 
          className={`type-button ${accountType === 'CLIENT' ? 'active' : ''}`}
          type="button"
          onClick={() => handleAccountTypeChange('CLIENT')}
        >
          Consumidor
        </button>
        <button 
          className={`type-button ${accountType === 'PRODUCER' ? 'active' : ''}`}
          type="button"
          onClick={() => handleAccountTypeChange('PRODUCER')}
        >
          Productor
        </button>
      </div>

      <form className="register-form" action={handleSubmit}>
        <input 
          className="text-input" 
          type="text" 
          placeholder="Nombre completo"
          name='fullName'
          required 
        />
        <input 
          className="text-input" 
          type="email" 
          placeholder="Correo electrónico" 
          name='email'
          required 
        />
        <input 
          className="text-input" 
          type="password" 
          placeholder="Contraseña" 
          name='password'
          required 
        />
        <input 
          className="text-input" 
          type="password" 
          placeholder="Confirmar contraseña" 
          name='confirmedPassword'
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

