import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { getAuth } from "firebase/auth";

export const AUTH_HEADER = "X-Authorization-Firebase";

const baseApi = axios.create();

baseApi.interceptors.request.use(
  async (config: AxiosRequestConfig) => {
    // @ts-ignore
    config.headers[AUTH_HEADER] = await getAuth()?.currentUser?.getIdToken();
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const apiGetCall = async (
  endpoint: string,
  options?: AxiosRequestConfig
) => {
  return baseApi.get(endpoint, options);
};

export const apiPostCall = async (
  endpoint: string,
  data?: any,
  options?: AxiosRequestConfig
) => {
  return baseApi.post(endpoint, data, options);
};

export const apiPutCall = async (
  endpoint: string,
  data?: any,
  options?: AxiosRequestConfig
) => {
  return baseApi.put(endpoint, data, options);
};

export const apiDeleteCall = async (endpoint: string) => {
  return baseApi.delete(endpoint);
};

export const getApiError = (error: AxiosError) => {
  if (error.response) {
    return error.response.data;
  } else if (error.request) {
    return "Services are unreachable";
  } else {
    return error.message;
  }
};
