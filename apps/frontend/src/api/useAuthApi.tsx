import { useMutation, useQuery } from '@tanstack/react-query';
import axios from './config/axios.config.ts';
import {
    AUTH_ENDPOINTS,
    GoogleLoginBody,
    LoginBody,
    LoginResponse,
    User,
    RegisterBody,
} from './api.types.ts';
import { removeAccessToken, setAccessToken } from '../auth/auth.utils.ts';
import { AxiosResponse } from 'axios';

const useAuthApi = () => {
    const useLogin = () =>
        useMutation(async (body: LoginBody) => {
            const response = await axios.post(AUTH_ENDPOINTS.LOGIN, body);
            return handleResponse(response);
        });

    const useRegister = () =>
        useMutation(async (body: RegisterBody) => {
            const response = await axios.post(AUTH_ENDPOINTS.REGISTER, body);
            return handleResponse(response);
        });

    const useAuthenticateByGoogle = () =>
        useMutation(async (body: GoogleLoginBody) => {
            const response = await axios.post(
                AUTH_ENDPOINTS.LOGIN_GOOGLE,
                body,
            );
            return await handleResponse(response);
        });

    const useCurrentUser = () => {
        return useQuery<User, Error>({
            queryKey: ['user'],
            queryFn: async () => {
                const response = await axios.get<User>(
                    AUTH_ENDPOINTS.CURRENT_USER,
                );
                if (response.status === 200 && response.data) {
                    return response.data;
                } else {
                    throw new Error('Failed to fetch user data');
                }
            },
            staleTime: 1000 * 60 * 5, // 5 minutes
            refetchOnWindowFocus: false,
        });
    };

    const handleResponse = (
        res: AxiosResponse<LoginResponse>,
    ): Promise<LoginResponse> => {
        return new Promise<never>((resolve, reject) => {
            if (res.status !== 200 && res.status !== 201) {
                reject('Error');
            }

            const { accessToken } = res.data;

            if (accessToken) {
                setAccessToken(accessToken);
                axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            } else {
                removeAccessToken();
                delete axios.defaults.headers.common.Authorization;
                reject('No token');
            }

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            resolve(res.data);
        });
    };

    return { useLogin, useAuthenticateByGoogle, useCurrentUser, useRegister };
};

export default useAuthApi;
