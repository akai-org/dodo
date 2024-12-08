import { LoginBody, RegisterBody } from '../api/api.types.ts';

export interface LoginValidationErrors {
    email?: string;
    password?: string;
}

export interface RegisterValidationErrors {
    username?: string;
    email?: string;
    password?: string;
}

export type LoginForm = LoginBody;
export type RegisterForm = RegisterBody;
