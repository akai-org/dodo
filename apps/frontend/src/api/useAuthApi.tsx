import {useMutation, useQuery} from "@tanstack/react-query";
import axios from "./config/axios.config.ts";
import {AUTH_ENDPOINTS, GoogleLoginBody, LoginBody, LoginResponse, User} from "./api.types.ts";
import { removeAccessToken, setAccessToken } from "../auth/auth.utils.ts";
import { AxiosResponse } from "axios";

const useAuthApi = () => {
    const useLogin = () =>
        useMutation(
            async (body: LoginBody) => {
                const response = await axios.post(AUTH_ENDPOINTS.LOGIN, body);
                return handleResponse(response);
            }
        );

    const useAuthenticateByGoogle = () =>
        useMutation(
            async (body: GoogleLoginBody) => {
                const response = await axios.post(AUTH_ENDPOINTS.LOGIN_GOOGLE, body);
                return await handleResponse(response);
            }
        );

    const useCurrentUser = () =>
        useQuery<User>([
            "user",
            async () => {
                const response = await axios.get(AUTH_ENDPOINTS.CURRENT_USER);
                return await handleResponse(response);
            }
            ]
        );

    const handleResponse = (res: AxiosResponse<LoginResponse>): Promise<LoginResponse> => {
       return new Promise<never>((resolve, reject) => {
           if(res.status !== 200) {
               reject("Error");
           }

           const { accessToken } = res.data;

           if (accessToken) {
               setAccessToken(accessToken);
               axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
           } else {
               removeAccessToken();
               delete axios.defaults.headers.common.Authorization;
               reject("No token");
           }

           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
           // @ts-expect-error
           resolve(res.data);
       })
    };

    return { useLogin, useAuthenticateByGoogle, useCurrentUser };
};

export default useAuthApi;