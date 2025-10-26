import './Login.css';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../../services/auth';
import { LoginForm } from './LoginForm';

const Login = () => {
  const heroImage =
    'https://media.istockphoto.com/id/543212762/es/foto/tractor-en-el-campo-de-primavera-relaciones-sean.jpg?s=612x612&w=0&k=20&c=ua9ZJb046xHKUDsRW2okFfKYJyNd12RMXZ8vESdjUHc=';

  const mutation = useMutation({
    mutationFn: loginData => login(loginData),
    onSuccess: (data) => {
      const { token } = data;
      localStorage.setItem('token', token)
    },
    onError: error => {
      console.log('Error al iniciar sesión: ', error);
    },
  });

  const handleSubmit = data => {
    mutation.mutate(data);
  };

  return (
    <main className="login-page">
      <section className="login-card">
        <div className="login-left">
          <LoginForm onSubmit={handleSubmit} />
        </div>

        <div className="login-right">
          <img src={heroImage} alt="Cultivo en el campo" />
        </div>
      </section>
    </main>
  );
};

export { Login };
