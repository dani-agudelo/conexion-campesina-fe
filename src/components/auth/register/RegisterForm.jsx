import { useState } from 'react';
import { UserRole } from '../../../types/enums'

const RegisterForm = ({ onSubmit }) => {
  const [accountType, setAccountType] = useState(UserRole.CLIENT);

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

