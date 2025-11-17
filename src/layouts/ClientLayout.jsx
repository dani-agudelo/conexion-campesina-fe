import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/ui/sidebar';
import { Navbar } from '../components/ui/navbar/Navbar';
import { UserRole } from '../types/enums';
import './ClientLayout.css';

const ClientLayout = () => {
  return (
    <>
      <Navbar />
      <div className="client-layout">
        <Sidebar userRole={UserRole.CLIENT} />
        <main className="client-layout__content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export { ClientLayout };

