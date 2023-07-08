import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

interface ApiCallOptions {
  headers?: Record<string, string>;
  body?: Record<string, any>;
  queryParams?: Record<string, any>;
}

// type ApiResponse<T = null> = {
//   status: number;
//   message: string;
//   data: T | null;
//   success: boolean;
//   error: ApiError | null;
// }

interface ApiResponse<T = any> {
  error: ApiError | null;
  data:T | null;
  ok: Boolean;
}

interface ApiError {
  errorCode: number;
  errorPage: string;
  errorType: string;
  errorMessage: string;
}

const apiCall = async <T>(
  requestType: string,
  endpoint: string,
  { headers = {}, body = {}, queryParams = {} }: ApiCallOptions = {}
): Promise<ApiResponse<T>> => {
  try {
    // Set default headers if provided
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      // Add any other default headers here
    };
    headers = { ...defaultHeaders, ...headers };

    // Prepare request config
    const requestConfig: AxiosRequestConfig = {
      method: requestType,
      url: endpoint,
      headers,
      params: queryParams,
      data: body,
      withCredentials: true,
    };

    // console.log("========request config====", requestConfig)
    // Make API request
    const response: AxiosResponse<T> = await axios(requestConfig);

    // Return response data in predefined format
    return {
      ok: true,
      error: null,
      data: response.data,
    };
  } catch (error: any) {
    // Handle error and return error data in predefined format
    return {
      error: {
        errorCode: error.response?.status || 500,
        errorPage: endpoint,
        errorType: 'api_error',
        errorMessage: error.response?.data.message ||error.message,
      },
      data: null,
      ok: false,
    };
  }
};

export default apiCall;
