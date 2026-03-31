import axios, { AxiosInstance } from 'axios';
import { env } from '../config/env';

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL: env.BASE_URL,
    });
  }
}

const http = new Http().instance;
export default http;
