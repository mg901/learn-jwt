export interface IHttpClientError<FailData = unknown> extends Error {
  readonly status?: number;
  readonly statusText: string;
  readonly data: FailData;
}

export type Method = 'GET' | 'POST' | 'DELETE' | 'PUT';
export type ClientHeaders = Record<string, string | number | boolean>;

export type HttpClientOptions = {
  url: string;
  method: Method;
  headers?: ClientHeaders;
  body?: any;
  signal?: AbortSignal;
};

export type InitOptions = {
  baseURL: string;
  onError?: (error: IHttpClientError) => void;
};
