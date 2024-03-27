import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

const getJWT = () => localStorage.getItem("jwt");

// set the JWT token in the Authorization header
export const setAxiosAuthHeader = (token: string) => {
  instance.interceptors.request.use((config) => {
    const jwt = token || getJWT();

    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`;
      return config;
    }

    throw new Error("No JWT token found");
  });
};

export const login = async (
  email: string,
  password: string
): Promise<AxiosResponse> => {
  return instance.post("/auth/login?role=admin", { email, password });
};

export const getMe = async (): Promise<AxiosResponse> => {
  return instance.get("/api/v1/users/me");
};
