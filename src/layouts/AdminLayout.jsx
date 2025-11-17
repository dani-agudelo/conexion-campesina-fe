import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/ui/navbar/Navbar';
import './AdminLayout.css';

const AdminLayout = () => {
  return (
    <>
      <Navbar />
      <div className="admin-layout">
        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export { AdminLayout };

