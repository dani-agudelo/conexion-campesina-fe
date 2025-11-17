import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/ui/sidebar';
import { Navbar } from '../components/ui/navbar/Navbar';
import { UserRole } from '../types/enums';
import './ProducerLayout.css';

const ProducerLayout = () => {
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

