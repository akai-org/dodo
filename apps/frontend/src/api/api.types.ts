export const API_PORT = 5000;
export const API_ADDRESS = `http://localhost:${API_PORT}`;

export enum AUTH_ENDPOINTS {
    LOGIN = '/login',
    LOGIN_GOOGLE = '/google/login',
    CURRENT_USER = '/currentUser',
}

export interface LoginResponse {
    accessToken: string
}

export interface LoginBody {
    email: string
    password: string
}

export interface GoogleLoginBody {
    token?: string;
}

export interface User {
    username: string
}