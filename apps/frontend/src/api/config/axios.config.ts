import Axios from 'axios';
import {getAccessToken, removeAccessToken} from "../../auth/auth.utils.ts";
// CONSTRAINTS MOVE TO ENV
export const API_PORT = 5000;
export const API_ADDRESS = `http://localhost:${API_PORT}`;

const axios = Axios.create({
    baseURL: API_ADDRESS,
});

axios.interceptors.request.use((config) => {
    config.headers.Authorization =  `Bearer ${getAccessToken() ?? ''}`;
    return config;
});

axios.interceptors.response.use((res) => res, (err) => {
    if (err.request.status === 401 && !err.request.responseURL.includes('login')) {
        removeAccessToken();
        delete axios.defaults.headers.common.Authorization;
    }

    return err;
});

export default axios;


