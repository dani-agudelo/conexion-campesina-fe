import { MAIN_ROUTES } from '../../constants/pages/pages';
import { useAuth } from '../../state/auth';
import {
    Navigate,
} from "react-router-dom";
import { Spinner } from '../ui/spinner/Spinner';

const ProtectedRoute = ({ allowedRoles, children }) => {
    const currentUser = useAuth(state => state.currentUser);

    if (currentUser === undefined) {
        return <Spinner />;
    }

    if (currentUser === null) {
        return <Navigate to="/login" replace />;
    }

    if (
        currentUser &&
        allowedRoles && !allowedRoles.includes(currentUser.role)
    ) {
        return <Navigate to={MAIN_ROUTES[currentUser.role]} replace />;
    }

    return children;
}

export { ProtectedRoute };