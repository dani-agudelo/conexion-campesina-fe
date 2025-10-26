import './Register.css';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../../services/auth';
import { RegisterForm } from './RegisterForm';

const Register = () => {
  const mutation = useMutation({
    mutationFn: registerData => register(registerData),
    onSuccess: () => {
      console.log('Cuenta creada');
    },
    onError: error => {
      console.log('Error al crear la cuenta: ', error);
    },
  });

  const handleSubmit = data => {
    mutation.mutate(data);
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
