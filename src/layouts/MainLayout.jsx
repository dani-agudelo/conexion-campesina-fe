import { Outlet } from 'react-router-dom';
import { useAuth } from '../state/auth';
import { useUserQuery } from '../hooks/query/useUserQuery';
import { Navbar } from '../components/ui/navbar/Navbar';
import { Spinner } from '../components/ui/spinner/Spinner';
import {
    Navigate,
} from "react-router-dom";

const MainLayout = () => {
    const setCurrentUser = useAuth(state => state.setCurrentUser);

    console.lo

    const { isLoading, isError, data } = useUserQuery();

    if (isLoading) return <Spinner />;
    if (isError) return <Navigate to="/login" replace />;

    setCurrentUser(data.user);

    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
}

export { MainLayout };
