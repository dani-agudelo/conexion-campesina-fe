import './Login.css';
import { LoginForm } from './LoginForm';

const Login = () => {
  const heroImage =
    'https://media.istockphoto.com/id/543212762/es/foto/tractor-en-el-campo-de-primavera-relaciones-sean.jpg?s=612x612&w=0&k=20&c=ua9ZJb046xHKUDsRW2okFfKYJyNd12RMXZ8vESdjUHc=';

  const handleSubmit = (e) => {
    // Aquí irá la lógica de autenticación
    console.log('Login submitted');
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
