import axios, {
  AxiosInstance, AxiosRequestConfig,
} from 'axios';

export class AxiosService {
  private axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (err) => {
        const error = err.response;

        if (error?.data) {
          throw error.data;
        }

        throw error;
      },
    );
  }

  // eslint-disable-next-line class-methods-use-this
  private addHeaders(userConfig: any = {}) {
    const globalHeaders: any = {};

    // You can set global headers here
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      globalHeaders.Authorization = `Bearer ${authToken}`;
    }

    const { headers } = userConfig;

    // Return extended config
    return {
      ...userConfig,
      headers: {
        ...globalHeaders,
        ...headers,
      },
    };
  }

  // GET method
  public get<T>(endPoint: string, userConfig: AxiosRequestConfig = {}) {
    return this.axiosInstance.get<T>(endPoint, this.addHeaders(userConfig));
  }

  // POST method
  public post<T>(endPoint: string, data = {}, userConfig: AxiosRequestConfig = {}) {
    return this.axiosInstance.post<T>(endPoint, data, this.addHeaders(userConfig));
  }

  // Patch method
  public patch<T>(endPoint: string, data = {}, userConfig: AxiosRequestConfig = {}) {
    return this.axiosInstance.patch<T>(endPoint, data, this.addHeaders(userConfig));
  }

  // Put method
  public put<T>(endPoint: string, data = {}, userConfig: AxiosRequestConfig = {}) {
    return this.axiosInstance.put<T>(endPoint, data, this.addHeaders(userConfig));
  }

  // Delete method
  public delete<T>(endPoint: string, userConfig: AxiosRequestConfig = {}) {
    return this.axiosInstance.delete<T>(endPoint, this.addHeaders(userConfig));
  }
}

export const axiosService = new AxiosService();
