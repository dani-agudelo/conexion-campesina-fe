import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/ui/sidebar';
import { Navbar } from '../components/ui/navbar/Navbar';
import { useAuth } from '../state/auth';
import { useUserQuery } from '../hooks/query/useUserQuery';
import { UserRole } from '../types/enums';
import { Spinner } from '../components/ui/spinner/Spinner';
import { Navigate } from 'react-router-dom';
import './ProducerLayout.css';

const ProducerLayout = () => {
  const setCurrentUser = useAuth((state) => state.setCurrentUser);
  const { isLoading, isError, data } = useUserQuery();

  if (isLoading) return <Spinner />;
  if (isError) return <Navigate to="/login" replace />;

  setCurrentUser(data.user);

  return (
    <>
      <Navbar />
      <div className="producer-layout">
        <Sidebar userRole={UserRole.PRODUCER} />
        <main className="producer-layout__content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export { ProducerLayout };

