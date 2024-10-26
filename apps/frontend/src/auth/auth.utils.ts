import {LoginForm, LoginValidationErrors} from "./auth.types.ts";

export const verifyToken = (): boolean => {
    return getAccessToken != null;
}

export const getAccessToken = () => {
    if (!(localStorage.getItem('access_token') == null)) {
        return localStorage.getItem('access_token');
    }
    return null;
}

export const setAccessToken = (token: string) => {
    localStorage.setItem('access_token', token);
}

export const removeAccessToken = () => {
    try {
        localStorage.removeItem('access_token');
    } catch {
        return;
    }
}

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
