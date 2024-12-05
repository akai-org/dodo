import {
    LoginForm,
    LoginValidationErrors,
    RegisterForm,
    RegisterValidationErrors,
} from './auth.types.ts';
import { jwtDecode } from 'jwt-decode';

export const verifyToken = (): boolean => {
    const token = getAccessToken();
    if (!token) {
        return false;
    }

    try {
        const decodedToken = jwtDecode(token);
        const currentTimestamp = Math.floor(Date.now() / 1000);
        return (decodedToken.exp ?? 0) > currentTimestamp;
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
        return false;
    }
};

export const getAccessToken = () => {
    if (!(localStorage.getItem('access_token') == null)) {
        return localStorage.getItem('access_token');
    }
    return null;
};

export const setAccessToken = (token: string) => {
    localStorage.setItem('access_token', token);
};

export const removeAccessToken = () => {
    try {
        localStorage.removeItem('access_token');
    } catch {
        return;
    }
};

export const loginFormValidator = (form: LoginForm) => {
    const errors: LoginValidationErrors = {};
    const emailRegex = /^[\w-]{1,30}@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!form.email) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Email is not in a valid format';
    }
    if (!form.password) {
        errors.password = 'Password is required';
    }

    return errors;
};

export const registerFormValidator = (form: RegisterForm) => {
    const errors: RegisterValidationErrors = {};
    const emailRegex = /^[\w-]{1,30}@([\w-]+\.)+[\w-]{2,4}$/g;
    if (!form.email) {
        errors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
        errors.email = 'Email is not in a valid format';
    }
    if (!form.password) {
        errors.password = 'Password is required';
    } else if (form.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
    }
    if (!form.username) {
        errors.username = 'Username is required';
    } else if (form.username.length < 3) {
        errors.username = 'Username must be at least 3 characters';
    }

    return errors;
};
