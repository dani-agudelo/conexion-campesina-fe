import './Register.css';
import { useMutation } from '@tanstack/react-query';
import { register } from '../../../services/auth';
import { RegisterForm } from './RegisterForm';
import { useNavigate } from 'react-router-dom';
import { showSuccessAlert, showErrorAlert } from '../../../utils/sweetAlert';

const Register = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: registerData => register(registerData),
    onSuccess: (data) => {
      if (data.status && data.status !== 201) {
        showErrorAlert(data.message);
        return;
      }

      showSuccessAlert('Cuenta creada correctamente')

      navigate('/login');

    },
    onError: error => {
      console.log('Error al crear la cuenta: ', error);
      showErrorAlert(error.message);
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
