import './Register.css';
import { RegisterForm } from './RegisterForm';

const Register = () => {
  const handleSubmit = (e, accountType) => {
    // Aquí irá la lógica de registro
    console.log('Register submitted', accountType);
  };

  return (
    <main className="register-page">
      <div className="register-card">
        <RegisterForm onSubmit={handleSubmit} />
      </div>
    </main>
  );
};

export { Register };
