export enum AUTH_ENDPOINTS {
    LOGIN = '/auth/login',
    LOGIN_GOOGLE = '/auth/google/login',
    CURRENT_USER = '/users/me',
    REGISTER = '/auth/register', // possibly?
}

export interface LoginResponse {
    accessToken: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

// This interface is temporary
export interface RegisterBody {
    username: string;
    email: string;
    password: string;
}

export interface GoogleLoginBody {
    token?: string;
}

export interface User {
    username: string;
}
