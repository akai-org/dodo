import {FC, ReactElement, useEffect, useRef} from 'react';
import {Navigate, useLocation} from 'react-router';
import {Route} from "../router/router.types.ts";
import useAuthStore from "../store/auth/auth.store.ts";
import {verifyToken} from "./auth.utils.ts";

interface GuardProps {
    children: ReactElement;
}

const Guard: FC<GuardProps> = ({ children }): ReactElement => {
    const location = useLocation();
    const isLogin = location.pathname === Route.LOGIN;
    const {isAuthenticated, setIsAuthenticated } = useAuthStore();
    const hasCheckedToken = useRef(false);

    useEffect(() => {
        if (!isAuthenticated && !hasCheckedToken.current) {
            hasCheckedToken.current = true; // to prevent loop
            const tokenIsValid = verifyToken();

            if (tokenIsValid) {
                setIsAuthenticated(true);
            }
        }
    }, [isAuthenticated]);

    if (isLogin && isAuthenticated) {
        return <Navigate to={Route.HOME} state={{ from: location }} replace />;
    }

    if (!isAuthenticated && !isLogin) {
        return <Navigate to={Route.LOGIN} state={{ from: location }} replace />;
    }

    return children;
};

export const withGuard = (component: ReactElement): ReactElement => <Guard>{component}</Guard>
