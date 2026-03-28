import axios, { AxiosInstance } from "axios";

class Http {
  instance: AxiosInstance;

  constructor() {
    this.instance = axios.create({
      baseURL:
        typeof window !== "undefined" ? process.env.NEXT_PUBLIC_BASE_URL : "",
    });

  }
}

const http = new Http().instance;
export default http;
