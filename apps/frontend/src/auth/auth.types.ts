import {LoginBody} from "../api/api.types.ts";

export interface LoginValidationErrors {
    email?: string;
    password?: string;
}

export type LoginForm = LoginBody;