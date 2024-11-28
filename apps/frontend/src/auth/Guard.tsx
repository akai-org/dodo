import { FC, ReactElement, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router';
import { Route } from '../router/router.types.ts';
import { verifyToken } from './auth.utils.ts';
import useLocationStore from '../store/location/location.store.ts';

interface GuardProps {
    children: ReactElement;
}

const Guard: FC<GuardProps> = ({ children }): ReactElement => {
    const { setLocationPath } = useLocationStore();
    const location = useLocation();
    const isLogin = location.pathname === Route.LOGIN;

    const isTokenValid = verifyToken(); // = true

    useEffect(() => {
        setLocationPath(location.pathname);
    }, [location]);

    if (isLogin && isTokenValid) {
        return <Navigate to={Route.HOME} state={{ from: location }} replace />;
    }

    if (!isTokenValid && !isLogin) {
        return <Navigate to={Route.LOGIN} state={{ from: location }} replace />;
    }

    return children;
};

export const withGuard = (component: ReactElement): ReactElement => (
    <Guard>{component}</Guard>
);
