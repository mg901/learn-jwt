import type { AxiosError } from 'axios';
import axios from 'axios';
import * as types from './types';

export const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    return {
      ...config,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
  },
  (error: AxiosError) => {
    throw new HttpClientError(error);
  },
);

instance.interceptors.response.use(
  (config) => config,
  (error: AxiosError) => {
    const originalConfig = error.config;
    // @ts-ignore
    if (error.response?.status === 401 && !originalConfig?._isRetry) {
      // @ts-ignore
      originalConfig._isRetry = true;
      axios
        .request({
          url: `${process.env.REACT_APP_API_URL}/refresh`,
          method: 'GET',
          withCredentials: true,
        })
        .then((response) => {
          localStorage.setItem('token', response.data.accessToken);

          return instance.request(originalConfig);
        })
        .catch((error: AxiosError) => {
          console.log(error.response?.data);
        });
    }
    throw new HttpClientError(error);
  },
);

export const request = <T = void>(
  options: types.HttpClientOptions,
): Promise<T> => {
  const { url, method, body } = options;

  return instance
    .request({
      url,
      method,
      headers: options.headers,
      data: body,
    })
    .then((response) => response.data);
};

export class HttpClientError<D = any> extends Error {
  public readonly status?: number;

  public readonly statusText: string;

  public readonly data: D;

  constructor(error: AxiosError) {
    super(error.response?.data?.message);
    this.name = this.constructor.name;
    this.status = error.response?.status;
    this.statusText = error.response?.statusText ?? '';
    this.data = error.response?.data;
  }
}
